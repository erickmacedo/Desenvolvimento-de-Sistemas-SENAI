const sequelize = require('../database')
const { DataTypes} = require('sequelize')

const Pessoa = sequelize.define('Pessoa',{
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    idade:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    descricao:{
        type: DataTypes.STRING
    },
    avatar:{
        type: DataTypes.TEXT,
        defaultValue:''
    }
})

sequelize.sync()
    .then(()=> console.log("Tabela de pessoas sincronizada"))
    .catch(err => console.log("Erro ao sincronizar tabela produtos: ", err))

module.exports = Pessoa