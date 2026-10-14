const jwt = require('jsonwebtoken');
const protect = require('../middleware/auth');

process.env.JWT_SECRET = 'test_secret';

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('protect middleware', () => {
  test('rejects a request with no Authorization header', () => {
    const req = { headers: {} }, res = mockRes(), next = jest.fn();
    protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  test('rejects a token signed with a different secret', () => {
    const forged = jwt.sign({ id: 'abc' }, 'wrong_secret');
    const req = { headers: { authorization: `Bearer ${forged}` } }, res = mockRes(), next = jest.fn();
    protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
  test('accepts a valid token and sets req.userId', () => {
    const token = jwt.sign({ id: 'user123' }, 'test_secret');
    const req = { headers: { authorization: `Bearer ${token}` } }, res = mockRes(), next = jest.fn();
    protect(req, res, next);
    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
  });
});