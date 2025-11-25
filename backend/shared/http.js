// backend/shared/http.js

// mbështjell një controller async që të mos shkruajmë try/catch kudo
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 për rruge që s’ekzistojnë
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

// error handler global për çdo service
function onError(err, req, res, next) {
  console.error('❌ API error:', err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

module.exports = {
  asyncHandler,
  notFound,
  onError,
};
