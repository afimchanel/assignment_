async function ApiKey(req, res, next) {
  // check expir date
  if ((req.headers.api_key !== process.env.API_KEY) ) {
      return res.status(403).json({ "message": "Forbidden", "statusCode": 403 });
  }
  next();
}

module.exports = ApiKey;