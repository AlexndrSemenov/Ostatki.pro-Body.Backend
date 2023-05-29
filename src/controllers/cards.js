const Tool = require('../models/tool');
const BadRequestError = require('../errors/bad-request-err'); // 400

exports.createTool = (req, res, next) => {
  const {
    brand, name, link, article, quantity, unit, price, currency, type, supply, watched,
  } = req.body;
  Tool.create({
    brand, name, link, article, quantity, unit, price, currency, type, supply, watched,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

exports.getTools = (req, res, next) => Tool.find({})
  .then((cards) => res.send(cards))
  .catch(next);
