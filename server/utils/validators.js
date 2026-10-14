const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isStrongPassword = (password) =>
  typeof password === 'string' && password.length >= 12 && password.length <= 128 && password.trim().length > 0;

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');

const validateTaskInput = (body, { partial = false } = {}) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'A JSON object is required';
  const allowed = new Set(['title', 'description', 'status', 'dueDate']);
  if (Object.keys(body).some((key) => !allowed.has(key))) return 'Request contains unsupported fields';
  if (!partial && (typeof body.title !== 'string' || !body.title.trim())) return 'Title is required';
  if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 120)) {
    return 'Title must be between 1 and 120 characters';
  }
  if (body.description !== undefined && (typeof body.description !== 'string' || body.description.length > 1000)) {
    return 'Description must be a string of at most 1000 characters';
  }
  if (body.status !== undefined && !['pending', 'in-progress', 'done'].includes(body.status)) {
    return 'Status must be pending, in-progress, or done';
  }
  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== '') {
    if (typeof body.dueDate !== 'string' || Number.isNaN(Date.parse(body.dueDate))) return 'Due date must be a valid date';
  }
  return null;
};

module.exports = { isValidEmail, isStrongPassword, normalizeEmail, validateTaskInput };