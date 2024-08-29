const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    process.env.DB_URL,
    // process.env.DB_NAME, // Название БД
    // process.env.DB_USER, // Пользователь
    // process.env.DB_PASSWORD, // ПАРОЛЬ

    {
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
    // {
    //     dialect: "postgres",
    //     host: process.env.DB_HOST,
    //     port: process.env.DB_PORT,
    //     sync: true,
    // }
);
