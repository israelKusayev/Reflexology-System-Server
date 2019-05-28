const Patinet = require('../../../models/Patient');
const request = require('supertest');
const User = require('../../../models/User');
const mockedPatients = require('../../mockData/patients');
const mongoose = require('mongoose');
const url = '/api/patients';
let server;
let token;
let userId;

describe(url, () => {
  beforeEach(() => {
    server = require('../../../index');
    userId = mongoose.Types.ObjectId();
    token = new User({ _id: userId }).generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await Patinet.deleteMany({});
  });

  describe('GET/', () => {
    let patients;

    beforeEach(async () => {
      patients = mockedPatients.getPatients(userId);
      await Patinet.collection.insertMany(patients);
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

    it('should return 200', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return just patients created by current user', async () => {
      const res = await exec();

      expect(res.body.length).toBe(3);
    });

    it('should return all patients sorted by last treatment in desc order', async () => {
      const res = await exec();

      expect(res.body[0]).toHaveProperty('firstName', 'first2');
    });
  });

  describe('POST/', () => {
    let patient;

    beforeEach(() => {
      patient = mockedPatients.getPatient();
    });

    const exec = () => {
      return request(server)
        .post(url)
        .set('x-auth-token', token)
        .send(patient);
    };

    it('should retun 400 if input is invalid (firstName)', async () => {
      delete patient.firstName;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should retun 400 if input is invalid (lastName)', async () => {
      delete patient.lastName;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return status 201 and the new patient', async () => {
      const res = await exec();

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining(['_id', 'firstName', 'lastName', 'createdAt'])
      );
    });
  });

  describe('PUT/', () => {
    let patient;
    let editedPatient;

    const exec = () => {
      return request(server)
        .put(url)
        .set('x-auth-token', token)
        .send(editedPatient);
    };

    beforeEach(async () => {
      mockedPatient = mockedPatients.getPatient();
      patient = new Patinet(mockedPatient);
      patient = await patient.save();

      editedPatient = {
        _id: patient._id,
        firstName: 'new',
        lastName: 'new'
      };
    });

    it('should retun 400 if input is invalid (firstName)', async () => {
      delete editedPatient.firstName;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should retun 400 if input is invalid (lastName)', async () => {
      delete editedPatient.lastName;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return the updated patient if it is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('firstName', 'new');
    });
  });
});
