const { isValidEmail, isStrongPassword, normalizeEmail, validateTaskInput } = require('../utils/validators');

describe('isValidEmail', () => {
  test('accepts a well-formed email', () => expect(isValidEmail('athar@example.com')).toBe(true));
  test('rejects a missing @', () => expect(isValidEmail('athar.example.com')).toBe(false));
  test('rejects an empty string and non-string input', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isStrongPassword', () => {
  test('accepts a long passphrase', () => expect(isStrongPassword('correct horse battery staple')).toBe(true));
  test('rejects short, whitespace-only and oversized passwords', () => {
    expect(isStrongPassword('short')).toBe(false);
    expect(isStrongPassword('            ')).toBe(false);
    expect(isStrongPassword('x'.repeat(129))).toBe(false);
  });
});

describe('normalizeEmail', () => {
  test('trims and lowercases email addresses', () => expect(normalizeEmail('  ATHAR@Example.com ')).toBe('athar@example.com'));
});

describe('validateTaskInput', () => {
  test('accepts a valid task', () => expect(validateTaskInput({ title: 'Study', status: 'pending' })).toBeNull());
  test('rejects missing and oversized titles', () => {
    expect(validateTaskInput({})).toBe('Title is required');
    expect(validateTaskInput({ title: 'x'.repeat(121) })).toBe('Title must be between 1 and 120 characters');
  });
  test('rejects invalid status, date and unexpected fields', () => {
    expect(validateTaskInput({ title: 'Task', status: 'unknown' })).toMatch(/Status/);
    expect(validateTaskInput({ title: 'Task', dueDate: 'not-a-date' })).toMatch(/Due date/);
    expect(validateTaskInput({ title: 'Task', user: 'other-user' })).toMatch(/unsupported fields/);
  });
  test('supports partial updates', () => expect(validateTaskInput({ status: 'done' }, { partial: true })).toBeNull());
});