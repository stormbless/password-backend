require('dotenv').config({ path: './.env' });
const { authenticationMiddleware } = require('./authentication');
const jwt = require('jsonwebtoken');

// test data

const inputUser = {account_id: 27658948, user_id: 81146743};
const expectedUser = {accountId: 27658948, userId: 81146743}
// random secret for testing purposes
const differentSecret = `18dda8713b98d7070e3d534a79ef6e37517ecaea2881461e4765
102a6a326e3b13fdeefc374b9cf5eedc344dcdd7e890b8ec10fed1ca8ec9ef227c9d7ad3bec0`;

// signed with client secret, expires in 5 minutes
const validToken = jwt.sign({
  dat: inputUser
}, process.env.CLIENT_SECRET, {expiresIn: 5 * 60 });

// signed without client secret, expires in 5 minutes
const unsignedToken = jwt.sign({
  dat: inputUser
}, differentSecret, {expiresIn: 5 * 60 });

// signed with client secret but expired (5 minutes ago)
const expiredToken = jwt.sign({
  dat: inputUser
}, process.env.CLIENT_SECRET, {expiresIn: -5 * 60 });


// TESTS

test('whether valid token accepted', () => {
  const req = {
    headers: {
      authorization: validToken
    }
  }
  const next = jest.fn();
  const res = {
    status: jest.fn().mockReturnThis(), // makes it chainable
    send: jest.fn()
  };
  
  authenticationMiddleware(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(req.session).toEqual(expectedUser);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
});

test('whether unsigned token rejected', () => {
  const req = {
    headers: {
      authorization: unsignedToken
    }
  };
  const next = jest.fn();
  const res = {
    status: jest.fn().mockReturnThis(), // makes it chainable
    send: jest.fn()
  };
  
  authenticationMiddleware(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(req.session).toBeUndefined();

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalled();
});

test('whether expired token rejected', () => {
  const req = {
    headers: {
      authorization: expiredToken
    }
  };
  const next = jest.fn();
  const res = {
    status: jest.fn().mockReturnThis(), // makes it chainable
    send: jest.fn()
  };
  
  authenticationMiddleware(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(req.session).toBeUndefined();

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalled();
});

