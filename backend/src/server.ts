import { httpServer } from './app';
import { config } from './config/config';
import Logger from './shared/utils/logger';

const port = config.app.port || 5000;

// Log environment information
Logger.info(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
Logger.info(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set (using default)'}`);
// Log CORS information without accessing non-existent property
Logger.info(`CORS configuration is set up for Socket.IO and Express`);

httpServer.listen(port, () => {
    Logger.info(`Server running on http://localhost:${port}`);
    Logger.info(`Socket.IO available at ws://localhost:${port}/socket.io/`);
});
