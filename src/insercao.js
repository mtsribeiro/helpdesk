const {getConnection} = require('./database');

async function InsereSia(data) {
    var sql = `INSERT INTO sias (assunto, 
                                 categoria, 
                                 descricao, 
                                 solucao, 
                                 arquivo, 
                                 prioridade, 
                                 sprint, 
                                 situacao, 
                                 ti, 
                                 responsavel) VALUES ('${data.assunto}', 
                                                      '${data.categoria}',
                                                      '${data.descricao}',
                                                      '${data.solucao}',
                                                      'Sem arquivo',
                                                      '${data.prioridade}',
                                                       0,
                                                      'Backlog',
                                                      'TI',
                                                      '${data.responsavel}')`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

module.exports = {InsereSia}