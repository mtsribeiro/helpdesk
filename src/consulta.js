const {getConnection} = require('./database');

async function carregaResultado(id) {
    var sql = `Select * From sias Where idsias = ${id}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

module.exports = {carregaResultado}