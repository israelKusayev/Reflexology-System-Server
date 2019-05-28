const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');

const User = require('../../../models/User.js');
const url = '/api/auth';
let server;

describe(url, () => {
  beforeAll(() => {
    server = require('../../../index');
    userId = mongoose.Types.ObjectId();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST/', () => {
    let user;

    const exec = () =>
      request(server)
        .post(url)
        .send(user);

    beforeEach(async () => {
      user = { username: '1234', password: '1234' };
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      user = await User.create(user);
      user.password = '1234';
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it('should return 400 if username is not supplied', async () => {
      user.username = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not supplied', async () => {
      user.password = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if user doesn`t exists', async () => {
      user.username = 'other';

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if password is wrong', async () => {
      user.password = '212121';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return token', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token', user.generateAuthToken());
    });
  });
});
