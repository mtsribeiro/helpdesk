const { BrowserWindow, Notification } = require("electron");
const {getConnection} = require('./database');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);
const {carregaResultado} = require('./consulta')
const {retornaUpdate} = require('./alteracao')
const notifier = require('node-notifier');

const port = 9000;

function NotificacaoAlterouSia () {
  notifier.notify({
    title: 'HelpDesk',
    message: 'Alterado com sucesso.'
  });
}

app.use(
    express.urlencoded({
      extended: true,
    })
);
  
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '../ui')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ui/home.html'))
})

function createWindow() {
    window = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
          }
    })
    window.loadURL(`http://localhost:${port}`);
    window.once('ready-to-show', () => {
        window.show()
      })
}

/*FECHA APLICAÇÃO*/
app.post('/fechaAplicacao', async (req, res) => {
    window.close()
})

app.post('/QueryTabelaChamado', async function (req, res) {
  
    var arrayLiteral2 = [];
  
    var sql = `SELECT * FROM sias`;
  
    const conn = await getConnection();
    await conn.query(sql, function(err2, results){
  
                
      results.forEach(e => {
  
        var objeto = {
          id: e.idsias,
          assunto: e.assunto,
          categoria: e.categoria,
          prioridade: e.prioridade,
          sprint: e.sprint,
          situacao: e.situacao,
          responsavel: e.responsavel,
          ti: e.ti
      }
    
            arrayLiteral2.push(objeto);
          })
  
          let saida = {
            "draw": 1,
            "recordsTotal": results.length,
            "recordsFiltered": results.length,
            "data": arrayLiteral2
          } 
          res.json(saida)
  
        })
  })

app.post('/sobeFormularioChamado', async function (req, res) {
    var retornaChamado = await carregaResultado(req.body.id)
    res.json(retornaChamado)
})

app.post('/salvarFormularioChamado', async function (req, res) {
    var carregaUpdate = await retornaUpdate(req.body);
    NotificacaoAlterouSia();
    res.json('Alterou')
})

  server.listen(port, () => {
    console.log(`Servidor web em: http://localhost:${port}`);
});

module.exports = {
    createWindow
}