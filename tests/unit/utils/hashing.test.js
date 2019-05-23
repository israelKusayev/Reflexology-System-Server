const utils = require('../../../utils/hashing');

describe('hashing', () => {
  it('should not return the same password', () => {
    const password = '123456';
    utils.hashPassword(password).then(hashedPassword => {
      expect(hashedPassword).not.toMatch(password);
    });
  });
});
