const usersController = {};

const usersService = require('../services/usersService')
const { validationResult } = require('express-validator');


usersController.getById = async function (req, res, next) {
    try {
        const id = req.params.id;
        const resultGetById = await usersService.getById(id);
        res.send(resultGetById);
    } catch (error) {
        res.status(500).send({ message: "Произошла ошибка при получении пользователя", error: error });
    }
};

usersController.authenticateUser = async function (req, res) {
    try {

        const dataUser = req.body

        if (!dataUser) {
            res.status(400).json({ success: false, message: 'Заполните форму' })
            return
        }

        const user = await usersService.authenticateUser(dataUser);
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Ошибка при авторизации пользователя' })
    }
};


usersController.createNewUser = async function (req, res, next) {
    const reqBody = req.body;
    console.log(reqBody)

    if (!reqBody) {
        return res.send.json({ success: false, message: 'Заполните форму' })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }

    try {

        const newUser = await usersService.createNewUser(reqBody);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, error: error });
    }

};


module.exports = usersController;