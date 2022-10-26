import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log', // указываем формат имени файла
  datePattern: 'YYYY-MM-DD-HH', // указываем шаблон для даты
  maxSize: '20m', // размер файла-лога
  zippedArchive: true, // архивирование
  maxFiles: 10, // удаление старья, когда кол-во файлов превысит 10 шт
});

// логер запросов
export const requestLogger = expressWinston.logger({
  transports: [
    // new winston.transports.Console({
    //   format: winston.format.simple(),
    // }),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

// логер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    transport,
  ],
  format: winston.format.json(),
});
