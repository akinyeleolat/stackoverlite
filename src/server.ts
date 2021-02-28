import { logger } from './utils/logger';
import { port } from './config';
import app from './app';

const Logger = logger;

/*
  @description handle specific listen errors with friendly messages
  */

function onError(error: Error): void {
    switch (error.name) {
        case 'EACCES':
            Logger.error(`${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            Logger.error(`${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

process.on('uncaughtException', e => {
    Logger.error(e);
});

// const app = expressApp();

app.listen(port, () => {
    Logger.info(`server running on port : ${port}`);
}).on('error', onError);
