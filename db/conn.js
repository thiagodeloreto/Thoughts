const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thoughts', 'root', '', {
    host: 'localhost',
    dialect:'mysql',
});

try {
    sequelize.authenticate()
    console.log('Connection has been established successfully.');
} catch (err) {
    console.log(`Conextion failed. Error: ${err}`);
}

module.exports = sequelize;