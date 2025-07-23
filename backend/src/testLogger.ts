import Logger from './shared/utils/logger';


Logger.error('This is an error message');
Logger.warn('This is a warning message');
Logger.info('This is an info message');
Logger.http('This is an HTTP message');
Logger.debug('This is a debug message');

Logger.info('Testing object logging', { 
  user: { id: 1, name: 'Test User' },
  action: 'login',
  timestamp: new Date().toISOString()
});

try {
  throw new Error('Test error');
} catch (error) {
  Logger.error('Caught an error', { error });
}

Logger.http('Incoming request', {
  method: 'POST',
  url: '/api/users',
  body: { username: 'testuser', email: 'test@example.com' },
  headers: { 'content-type': 'application/json' }
});

Logger.http('Outgoing response', {
  statusCode: 201,
  body: { id: 123, username: 'testuser', created: true },
  responseTime: '42ms'
});

