function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return res.status(409).json({ error: `${field} already exists` });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: "Database validation failed", details: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid identifier" });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Malformed JSON request body" });
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = { errorHandler, notFound };
