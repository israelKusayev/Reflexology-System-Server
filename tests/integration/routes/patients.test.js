const Patinet = require('../../../models/Patient');
const request = require('supertest');
const User = require('../../../models/User.js');
const moment = require('moment');
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
    await Patinet.remove({});
  });

  describe('GET/', () => {
    let patients;
    beforeEach(async () => {
      patients = [
        {
          firstName: 'first1',
          lastName: 'last1',
          lastTreatment: moment(),
          createdBy: userId
        },
        {
          firstName: 'first2',
          lastName: 'last2',
          lastTreatment: moment().add(1, 'days'), // the last treatment
          createdBy: userId
        },
        {
          firstName: 'first3',
          lastName: 'last3',
          lastTreatment: moment(),
          createdBy: userId
        },
        {
          firstName: 'first4',
          lastName: 'last4'
        }
      ];

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
      patient = {
        firstName: '12345',
        lastName: '12345'
      };
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
    let _id;
    let editedPatient;

    const exec = () => {
      return request(server)
        .put(url)
        .set('x-auth-token', token)
        .send(editedPatient);
    };

    beforeEach(async () => {
      editedPatient = {
        _id: _id,
        firstName: 'new',
        lastName: 'new',
        createdBy: userId
      };

      patient = new Patinet({
        _id: _id,
        firstName: 'first1',
        lastName: 'last1',
        createdBy: userId
      });
      await patient.save();

      _id = patient._id;
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
