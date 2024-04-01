const usersRepository = {};
const dbPool = require('../db_pool/db_pool')


usersRepository.getById = async function (id) {
    try {
        const client = await dbPool.connect();
        const result = await client.query('SELECT * FROM users WHERE userid = $1', [id]);
        client.release();

        if (result.rows.length === 0) {
            return null; // или выбросить ошибку, если считаете это более уместным
        }

        return result.rows[0];
    } catch (error) {
        console.error("Ошибка при запросе к базе данных: ", error);
        throw error; // Перебрасываем для обработки на уровне сервиса
    }
};

usersRepository.findByEmailAndPassword = async function (email, password) {
    const client = await dbPool.connect();
    
    try {
        
        const result = await client.query('SELECT * FROM Users WHERE Email = $1 AND passwordhash = $2', [email, password]);
        if (result.rows[0]) {

            const resultAnswer = {
                success: true,
                email: email,
                userid: result.rows[0].userid
            }
            return resultAnswer
        }

        return {
            success: false,
            message: 'Неверный email или пароль'
        }



    } catch (error) {
        console.error("Ошибка при запросе к базе данных: ", error);
        return {
            success: false,
            error: error,
            message: "Ошибка при запросе к базе данных: "
        }
    } finally {
        client.release();
    }
};



usersRepository.createNewUser = async function (userData) {
    if (!userData) throw new Error('One or more parameters undefined')

    try {
        const client = await dbPool.connect();

        client.query('INSERT INTO users (username, email, passwordhash) VALUES ($1, $2, $3)',
            [userData.username, userData.email, userData.passwordhash]);

        return {
            success: true,
            message: 'Пользователь успешно создан'
        }
    }
    catch (err) {

        return {
            success: false,
            error: err
        }

    }

}

usersRepository.findByEmailOrUsername = async function (email, username) {
    const client = await dbPool.connect();
    try {
        const query = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const result = await client.query(query, [email, username]);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (err) {
        console.error('Ошибка при поиске пользователя: ', err);
        throw err;
    } finally {
        client.release();
    }
};


module.exports = usersRepository;