const {getConnection} = require('./database');

async function retornaUpdate(data) {
    var sql = `UPDATE sias SET responsavel = '${data.responsavel}', 
                               ti = '${data.ti}',
                               assunto = '${data.assunto}',
                               categoria = '${data.categoria}',
                               prioridade = '${data.prioridade}',
                               sprint = ${data.sprint},
                               situacao = '${data.situacao}',
                               descricao = '${data.descricao}',
                               solucao = '${data.solucao}'
                            Where idsias = ${data.idsias}`
    const conn = await getConnection();
    const resultado = await conn.query(sql)
    return resultado
}

module.exports = {retornaUpdate}