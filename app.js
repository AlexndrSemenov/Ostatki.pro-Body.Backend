require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');// здесь обрабатываем ошибки валидации celebrate
const cors = require('cors');
const cardRouter = require('./src/routes/cards');
const NotFoundError = require('./src/errors/not-found-err'); // 404
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = 3001 } = process.env;
const app = express();

// добавляем bodyParser по-новому
app.use(express.json());

// разрешаем кроссдоменные запросы
app.use(cors());

app.use(requestLogger); // подключаем логгер запросов до обработчиков всех роутов

// Приложение должно работать в процессе, который в случае
// падения автоматически восстанавливается. Сделать это поможет pm2.
// Не забудьте удалить этот код после успешного прохождения ревью.
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключаем роутер
app.use('/', cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

app.use(errorLogger); // подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок
// обработчик ошибок celebrate
app.use(errors());
// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

(async function main() {
  await mongoose.connect('mongodb://localhost:27017/electrictools');
  console.log('Connected to db');

  app.listen(PORT);
  console.log(`App listening on ${PORT}`);
}());
