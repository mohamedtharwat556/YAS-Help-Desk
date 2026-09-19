// ============================================================
// YAS Help Desk - Error Handler Middleware
// ============================================================

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Validation Error';
    error.details = err.details;
  }

  if (err.name === 'UnauthorizedError') {
    error.status = 401;
    error.message = 'Unauthorized';
  }

  if (err.code === '23505') { // Unique violation in PostgreSQL
    error.status = 409;
    error.message = 'Duplicate entry';
  }

  if (err.code === '23503') { // Foreign key violation
    error.status = 400;
    error.message = 'Invalid reference';
  }

  // Prisma specific errors
  if (err.code === 'P2002') {
    error.status = 409;
    error.message = 'Record already exists';
  }

  if (err.code === 'P2025') {
    error.status = 404;
    error.message = 'Record not found';
  }

  res.status(error.status).json(error);
};

module.exports = errorHandler;
