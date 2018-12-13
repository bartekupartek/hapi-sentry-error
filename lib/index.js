'use strict';

const Sentry = require('@sentry/node');
const Joi = require('joi');
const schema = require('./schema');

exports.register = (server, options) => {
  const config = Joi.attempt(options, schema, 'Invalid hapi-sentry-error options:');
  Sentry.init(config);
  server.events.on({ name: 'request', channels: ['error'] }, (request, errorEvent) => {
    Sentry.withScope(scope => {
      scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, {
        ...request.raw.req,
        ...(request.payload ? { body: request.payload } : {})
      }));
      Sentry.captureException(errorEvent.error);
    });
  });
};

exports.pkg = require('../package.json');
