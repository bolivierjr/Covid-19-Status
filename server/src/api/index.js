import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import httpError from 'http-errors';
import config from '../config';
import routes from './routes';

export default async app => {
  // Trust first proxy
  app.set('trust proxy', 1);

  /**
   * Default Middlewares
   */

  // Sets up secure http headers
  app.use(helmet());
  // Transform the raw string of req.body to json
  app.use(bodyParser.json());
  // Enable CORS to all origins by default
  app.use(cors());
  // Compresses response bodies
  app.use(compression());

  /**
   * API Routes
   */

  //   app.use('/api/', routes());

  /**
   * Error handlers
   */

  // If it reaches no endpoint, throw a NotFound error
  app.use((req, res, next) => {
    const err = httpError(404);
    next(err);
  });

  // Error handler returns response back
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
    });
    next(err);
  });
};
