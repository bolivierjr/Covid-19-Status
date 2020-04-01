import { Container } from 'typedi';
import Logger from './logger';
import ReportModel from '../models/report';

/**
 * Dependency injector loader to inject single
 * instances anywhere into the app.
 * @returns {void}
 */
export default () => {
  Container.set('logger', Logger);
  Container.set('ReportModel', ReportModel);
};
