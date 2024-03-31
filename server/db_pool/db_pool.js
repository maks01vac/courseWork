const config = require('../config/config')
const pool = require('pg').Pool

const dbPool = new pool(config.database)

module.exports = dbPool;