import { createLogger, format, transports } from 'winston';

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.json(),
	),
	defaultMeta: { service: 'dj-duolingo' },
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple(),
			),
		}),
		new transports.File({
			filename: 'logs/error.log',
			level: 'error',
			format: format.combine(
				format.timestamp(),
				format.json()),
		}),
		new transports.File({
			filename: 'logs/info.log',
			level: 'info',
			format: format.combine(
				format.timestamp(),
				format.json()),
		}),
	],
});

export default logger;