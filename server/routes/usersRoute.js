var express = require('express');
const { body } = require('express-validator');

const usersController = require('../controllers/usersController');

var usersRouter = express.Router();

usersRouter.get('/users/:id',usersController.getById);


usersRouter.post('/users', [
    body('username').isString().withMessage('Username должен быть строкой')
    .matches(/\D/).withMessage('Username должен содержать хотя бы одну букву'),
    body('email').isEmail().withMessage('Неверный формат email'),
    body('passwordhash').isLength({ min: 5 }).withMessage('Пароль слишком короткий')
], usersController.createNewUser);


// usersRouter.put('/users/:id',usersController.updateById);
  
// usersRouter.delete('/users/:id',usersController.deleteById);

module.exports = usersRouter; 