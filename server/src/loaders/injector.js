import { Container } from 'typedi';
import Logger from './logger';

/**
 * Dependency injector loader to inject single
 * instances anywhere into the app.
 *
 * @returns {void}
 */
export default () => {
  Container.set('logger', Logger);
};
