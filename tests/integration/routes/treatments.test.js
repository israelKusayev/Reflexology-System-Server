const Treatment = require('../../../models/Treatment');
const Patinet = require('../../../models/Patient');
const User = require('../../../models/User.js');
const mockTreatments = require('../../mockData/treatments.js');
const request = require('supertest');
const mongoose = require('mongoose');

const url = '/api/treatments/';
let server;
let token;
let userId;

describe(url, () => {
  beforeEach(async () => {
    server = require('../../../index');
    userId = mongoose.Types.ObjectId();
    token = new User({ _id: userId }).generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await Treatment.remove({});
    await Patinet.remove({});
  });

  describe('GET/', () => {
    let treatments;

    beforeEach(async () => {
      treatments = mockTreatments.getTreatments(userId);
      await Treatment.collection.insertMany(treatments);
    });

    const exec = () => {
      return request(server)
        .get(url)
        .set('x-auth-token', token);
    };

    it('shold return 401 if token was not provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return all treatments', async () => {
      const res = await exec();

      expect(res.body.length).toBe(treatments.length);
      expect(res.status).toBe(200);
    });
  });

  describe('GET/:patientId', () => {
    let treatments;
    beforeEach(async () => {
      treatments = mockTreatments.getTreatments(userId);

      await Treatment.collection.insertMany(treatments);
    });

    const exec = () => {
      return request(server)
        .get(url + userId)
        .set('x-auth-token', token);
    };

    it('should return only patient`s treatments', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should return treatments sorted by id (desc)', async () => {
      const res = await exec();

      expect(res.body[0].visitReason).toBe(treatments[1].visitReason);
    });
  });

  describe('POST/', () => {
    let treatment;

    beforeEach(() => {
      treatment = mockTreatments.getTreatment(userId);
    });

    const createPatient = id =>
      Patinet.create({
        _id: id,
        firstName: 'a',
        lastName: 'a',
        createdBy: mongoose.Types.ObjectId()
      });

    const exec = () =>
      request(server)
        .post(url)
        .set('x-auth-token', token)
        .send(treatment);

    it('should retun 400 if body.patientId is null', async () => {
      delete treatment.patientId;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should create new treatment', async () => {
      await createPatient(treatment.patientId);
      await exec();

      const createdTreatment = await Treatment.find();
      expect(createdTreatment.length).toBe(1);
      expect(createdTreatment[0].visitReason).toMatch(treatment.visitReason);
    });

    it('should return status 201 and the new treatment', async () => {
      await createPatient(treatment.patientId);

      const res = await exec();

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining(['_id', 'visitReason', 'date', 'patientId'])
      );
    });
  });

  describe('PUT/', () => {
    let treatment;

    beforeEach(async () => {
      treatment = mockTreatments.getTreatment(userId);
      treatment = await Treatment.create(treatment);

      treatment.visitReason = '1212';
    });

    const createPatient = id =>
      Patinet.create({
        _id: id,
        firstName: 'a',
        lastName: 'a',
        createdBy: mongoose.Types.ObjectId()
      });

    const exec = () =>
      request(server)
        .put(url)
        .set('x-auth-token', token)
        .send(treatment);

    it('should retun 400 if body.patientId is null', async () => {
      treatment.patientId = null;

      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should retun 400 if body.patientId is null', async () => {
      treatment._id = null;

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should edit the treatment', async () => {
      await createPatient(treatment.patientId);
      await exec();

      const editedTreatment = await Treatment.findById(treatment._id);
      expect(editedTreatment.visitReason).toMatch(treatment.visitReason);
      expect(editedTreatment.visitReason).toMatch('1212');
    });

    it('should return status 200 and the new treatment', async () => {
      await createPatient(treatment.patientId);

      const res = await exec();

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining(['_id', 'visitReason', 'date', 'patientId'])
      );
    });
  });
});
