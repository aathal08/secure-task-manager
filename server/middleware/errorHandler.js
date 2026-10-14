const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request body is too large' });
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ message: 'Malformed JSON body' });
  if (err.message === 'Origin not allowed by CORS') return res.status(403).json({ message: 'Origin not allowed' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ message: 'That value already exists' });
  const statusCode = err.status || err.statusCode || 500;
  if (statusCode >= 500) console.error(err);
  res.status(statusCode).json({
    message: statusCode >= 500 && process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Request failed'),
  });
};

module.exports = { notFound, errorHandler };