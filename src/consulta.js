const {getConnection} = require('./database');

async function carregaResultado(id) {
    var sql = `Select * From sias Where idsias = ${id}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboard(data) {
    var sql = `Select
                Sum(Case
                    When situacao like '%Backlog%' Then 1
                    Else 0
                End) as QtdBacklog,
                Sum(Case
                    When situacao like '%desenvolvimento%' Then 1
                    Else 0
                End) as QtdDesenvolvimento,
                Sum(Case
                    When situacao like '%teste%' Then 1
                    Else 0
                End) as QtdTeste,
                Sum(Case
                    When situacao like '%Finalizado%' Then 1
                    Else 0
                End) as QtdFinalizado
               From 
                sias`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

module.exports = {carregaResultado, carregaDashboard}