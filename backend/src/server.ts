import { httpServer } from './app';
import { config } from './config/config';
import Logger from './shared/utils/logger';

const port = config.app.port || 5000;

process.on('uncaughtException', (error) => {
    if (error.message === 'write EPIPE' &&
        error.stack && error.stack.includes('ts-node-dev')) {
        Logger.debug(`Development server EPIPE error (safe to ignore)`);
        return;
    }

    Logger.error(`Uncaught Exception: ${error.message}`);
    Logger.error(error.stack);
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
    Logger.error(`Unhandled Promise Rejection at: ${promise}`);
    Logger.error(`Reason: ${reason}`);
});

httpServer.listen(port, () => {
    Logger.info(`Server running on http://localhost:${port}`);
    Logger.info(`Socket.IO available at ws://localhost:${port}/socket.io/`);
});
