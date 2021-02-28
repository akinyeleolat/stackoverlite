import bodyParser from 'body-parser';
import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';

import { db } from './models';
import { routes } from './routes';
import { logger } from './utils/logger';
import { timeMiddleware } from './utils/middlewares';
import { environment } from './config';
import { NotFoundError, ApiError, InternalError } from './utils/ApiError';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export function expressApp() {
db.dbConfig
    .authenticate()
    .then(() => logger.info('connected to db'))
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });

const app: Application = express();

if (environment === 'production') {
    app.use(compression);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '5m' }));
app.use(timeMiddleware);

app.use('/', routes(db));

app.all('/', (req, res) => {
    res.json('welcome').status(200);
});

app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        ApiError.handle(err, res);
    } else {
        if (environment === 'development') {
            logger.error(err);
            return res.status(500).send(err.message);
        }
        ApiError.handle(new InternalError(), res);
    }
});

export default app;
// }
