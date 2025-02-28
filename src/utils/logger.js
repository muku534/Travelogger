import { logger } from 'react-native-logs';

const config = {
  severity: __DEV__ ? 'debug' : 'error',
  transport: __DEV__ ? (msg) => console.log(msg) : () => {},
};

const log = logger.createLogger(config);

export default log;
