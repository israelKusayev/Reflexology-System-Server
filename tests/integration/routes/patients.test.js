const Patinet = require('../../../models/Patient');
const request = require('supertest');

const url = '/api/patients';
let server;

describe(url, () => {
  it('wdew', () => {});
  beforeEach(() => {
    server = require('../../../index');
  });

  // afterEach(() => {
  //   server.close();
  //   await Patinet.remove({});
  // });

  // describe('GET/', () => {

  //   it('shold return 401 if token was not provided', async () => {
  //     const patients = [
  //       { firstName: 'first1', lastName: 'last1' },
  //       { firstName: 'first2', lastName: 'last2' }
  //     ];
  //     await Patinet.collection.insertMany(patients);

  //     const res = await request(server)
  //       .get(url)
  //       .set('x-auth-token', '');

  //     expect(res.status).toBe(401);
  //   });

  //   it('should return all patients', async () => {
  //     const patients = [
  //       { firstName: 'first1', lastName: 'last1' },
  //       { firstName: 'first2', lastName: 'last2' }
  //     ];

  //     await Patinet.collection.insertMany(patients);

  //     const res = await request(server).get(url);

  //     expect(res.status).toBe(401);
  //   });
  // });
});
