const ApiKey = require('../models/apiKey');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  try {
    const apiKeyRecord = await ApiKey.findByApiKey(apiKey);

    if (!apiKeyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.user = apiKeyRecord.user;
    next();
  } catch (error) {
    console.error('Error authenticating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = apiKeyAuth;