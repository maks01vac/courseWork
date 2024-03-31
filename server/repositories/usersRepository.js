const usersRepository = {};
const dbPool = require('../db_pool/db_pool')


usersRepository.getById = async function (id) {
    try {
        console.log(id)
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



usersRepository.createNewUser = async function (userData) {
    console.log('В репе')

    // if (!employeeData) throw new Error('One or more parameters undefined')

    try {
        console.log('В репе 2')
        const client = await dbPool.connect();
        console.log('Подключился к дб')
        client.query('INSERT INTO users (username, email, passwordhash) VALUES ($1, $2, $3)', 
        [userData.username, userData.email, userData.passwordhash]);
        console.log('Отправил sql')
        return {
            success: true,
        }
    }
    catch (err) {
        console.log('Шибка репа')
        return {
            success: false,
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