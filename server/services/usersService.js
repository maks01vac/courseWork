const usersService = {};
const userRepository = require('../repositories/usersRepository')


usersService.createNewUser = async function (userData) {
    const existingUser = await userRepository.findByEmailOrUsername(userData.email, userData.username);
    console.log(existingUser)
    if (existingUser) {
        throw new Error('Пользователь с таким email или username уже существует');
    }

    try {
        const newUser = await userRepository.createNewUser(userData);
        return newUser;
    } catch (err) {
        console.error('Ошибка при создании пользователя: ', err);

        return{
            success: false,
            message:'Ошибка при создании пользователя',
            error:err
        }
    }
};

usersService.authenticateUser = async (dataUser) => {
    try{
        const user = await userRepository.findByEmailAndPassword(dataUser.email, dataUser.password);
        console.log(user)
        return user
    }catch(err) {
        console.log(err)
        return{
            success:false,
            message:'Ошибка авторизации'
        }
    }
};

usersService.getById = async function (id) {
    console.log(id)
    if (!id || isNaN(Number(id))) {
        throw new Error("Неверный ID пользователя");
    }

    try {
        const user = await userRepository.getById(id);
        if (!user) {
            throw new Error("Пользователь не найден");
        }
        return user;
    } catch (error) {
        // Логирование ошибки можно добавить здесь
        console.error("Ошибка при получении пользователя: ", error);
        throw error; // Перебрасываем ошибку для обработки на более высоком уровне
    }
};

module.exports = usersService;

