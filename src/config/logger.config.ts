export const pinoOptions = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
      },
    },
    autoLogging: false,
    serializers: {
      req: () => {
        return undefined;
      },
      res: () => {
        return undefined;
      },
    },
  },
};
