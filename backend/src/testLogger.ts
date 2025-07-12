import Logger from './shared/utils/logger';

console.log('Starting logger test...');

// Test different log levels
Logger.error('This is an error message');
Logger.warn('This is a warning message');
Logger.info('This is an info message');
Logger.http('This is an HTTP message');
Logger.debug('This is a debug message');

// Test with objects
Logger.info('Testing object logging', { 
  user: { id: 1, name: 'Test User' },
  action: 'login',
  timestamp: new Date().toISOString()
});

// Test with error objects
try {
  throw new Error('Test error');
} catch (error) {
  Logger.error('Caught an error', { error });
}

// Test with request-like object
Logger.http('Incoming request', {
  method: 'POST',
  url: '/api/users',
  body: { username: 'testuser', email: 'test@example.com' },
  headers: { 'content-type': 'application/json' }
});

// Test with response-like object
Logger.http('Outgoing response', {
  statusCode: 201,
  body: { id: 123, username: 'testuser', created: true },
  responseTime: '42ms'
});

console.log('Logger test completed. Check the logs directory for log files.'); 