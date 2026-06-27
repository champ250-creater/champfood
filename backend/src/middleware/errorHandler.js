// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Always log the full error to the server console (visible in Render logs)
  console.error('❌ Error:', err.message);
  if (err.stack) {
    console.error('   Stack:', err.stack.split('\n').slice(0, 3).join('\n'));
  }

  // If the error already has a status code (e.g. 400, 401, 404), use it
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // Catch-all 500 — always include the message so you can debug on Render
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;
