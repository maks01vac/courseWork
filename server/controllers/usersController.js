const usersController = {};

const usersService = require('../services/usersService')
const { validationResult } = require('express-validator');


usersController.getById = async function (req, res, next) {
    try {
        const id = req.params.id;
        const resultGetById = await usersService.getById(id);
        console.log(resultGetById);
        res.send(resultGetById);
    } catch (error) {
        console.error(error);
        res.status(500).send("Произошла ошибка при получении пользователя");
    }
};


usersController.createNewUser = async function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log({errors: errors.array()})
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const reqBody = req.body;
        const newUser = await usersService.createNewUser(reqBody);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }

};


module.exports = usersController;