const Joi = require('joi');

module.exports = Joi.object().keys({
  dsn: Joi.string().uri().required(),
  environment: Joi.string(),
  serverName: Joi.string(),
  release: Joi.string()
});
