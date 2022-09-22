const {getConnection} = require('./database');

/*Pega Número da semana atual*/
function getYearlyWeekNumber(date) {
    var date = new Date(); 
    date.setHours(0, 0, 0, 0); 
    date.setDate(date.getDate() + 3 - (date.getDay() + 7) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

async function carregaResultado(id) {
    var sql = `Select * From sias Where idsias = ${id}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboard(data) {
    var numeroSemana = getYearlyWeekNumber(new Date())
    
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
                sias
               Where
                 sprint = ${numeroSemana}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboardBackLog() {
    var numeroSemana = getYearlyWeekNumber(new Date())

    var sql = `Select * From sias Where situacao = 'Backlog' and sprint = ${numeroSemana}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboardProducao() {
    var numeroSemana = getYearlyWeekNumber(new Date())

    var sql = `Select * From sias Where situacao = 'Desenvolvimento' and sprint = ${numeroSemana}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboardProducao() {
    var numeroSemana = getYearlyWeekNumber(new Date())

    var sql = `Select * From sias Where situacao = 'Desenvolvimento' and sprint = ${numeroSemana}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboardTeste() {
    var numeroSemana = getYearlyWeekNumber(new Date())

    var sql = `Select * From sias Where situacao = 'Teste' and sprint = ${numeroSemana}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

async function carregaDashboardFinalizado() {
    var numeroSemana = getYearlyWeekNumber(new Date())

    var sql = `Select * From sias Where situacao = 'Finalizado' and sprint = ${numeroSemana}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

module.exports = {carregaResultado,
                  carregaDashboard,
                  carregaDashboardBackLog, 
                  carregaDashboardProducao,
                  carregaDashboardTeste,
                  carregaDashboardFinalizado}