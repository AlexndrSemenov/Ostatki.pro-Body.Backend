const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createTool,
  getTools,
} = require('../controllers/cards');

router.get('/tools', getTools);

router.post('/tools', celebrate({
  body: Joi.object().keys({
    brand: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    article: Joi.number().required(),
    quantity: Joi.number().required(),
    unit: Joi.string().required(),
    price: Joi.number().required(),
    currency: Joi.string(),
    type: Joi.string().required(),
    supply: Joi.string().required(),
    watched: Joi.boolean().required(),
  }),
}), createTool);

module.exports = router;
