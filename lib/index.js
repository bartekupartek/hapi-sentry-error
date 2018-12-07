'use strict';

const Sentry = require('@sentry/node');

exports.register = (server, options) => {
  Sentry.init({ dsn: options.dsn });
  server.events.on({ name: 'request', channels: ['error'] }, (request, errorEvent) => {
    const req = Object.assign(request.raw.req, { body: request.payload });
    Sentry.withScope(scope => {
      scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, req));
      Sentry.captureException(errorEvent.error);
    });
  });
};

exports.pkg = require('../package.json');
