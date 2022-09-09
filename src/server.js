const { BrowserWindow, Notification } = require("electron");
const {getConnection} = require('./database');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);
const notifier = require('node-notifier');
const nodemailer = require("nodemailer");

const {carregaResultado} = require('./consulta')
const {retornaUpdate} = require('./alteracao')
const {InsereSia} = require('./insercao')

const port = 9000;

function NotificacaoAlterouSia () {
  notifier.notify({
    title: 'HelpDesk',
    message: 'Alterado com sucesso.'
  });
}

function NotificacaoInseriuSia () {
  notifier.notify({
    title: 'HelpDesk',
    subtitle: 'Inserido com sucesso.',
    message: 'Em breve a equipe de TI entrará em contato.'
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
  
    var sql = `SELECT * FROM sias Where situacao not like 'Finalizado'`;
  
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
    await retornaUpdate(req.body);

    var chamado = req.body.assunto;
    var situacao = req.body.situacao;
    var sprint = req.body.sprint;
    var responsavel = req.body.responsavel;

    if (situacao == 'Finalizado')
    {
      var html = `<td id="m_5802995636410960008m_-284055676835661507header-Logo-cta0a4e22de-622c-4c98-9dc7-25eb34d738f0" dir="ltr" style="padding:24px 24px 24px 30px" valign="top">
      <table style="max-width:600px;width:100%" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="left">
        <tbody>
          <tr>
            <td style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;padding-left:20px;font-size:14px;vertical-align:middle;width:99.6283%;text-align:right" align="left" valign="middle" width="300">
              <p>
                <img style="float:left" src="https://ci5.googleusercontent.com/proxy/wtAJkMQJwIRQipMHOw_9fyNG8lenQ-ZcvdDoENFMHNG04lMjrriYhIn3iEzYT0H3B5Ii0BhhsOlTiJDJ8wVLWQ=s0-d-e1-ft#https://conlinebr.com.br/logosirius_preta.png" alt="Google Cloud" width="154" height="61" class="CToWUd" data-bit="iit"></p>
            </td>
            <td style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;font-size:14px;vertical-align:middle;width:55.7621%;text-align:right;display:none" align="right" valign="middle" width="300">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="right">
                <tbody>
                  <tr>
                    <td dir="ltr" style="border-radius:4px" align="right" bgcolor="#1a73e8">
                      <a style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;color:#ffffff;text-decoration:none;font-size:14px;letter-spacing:1px;font-weight:bold;border-radius:4px;border:1px solid #1a73e8;margin:0;padding:14px 16px 14px 16px;display:inline-block" href="https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo%3D&amp;source=gmail&amp;ust=1662742549311000&amp;usg=AOvVaw3926zLP6hdVgr1_zx3YlAy"></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
      
      <h4>Olá</h4>
    
      <p>Seu chamado se encontra ${situacao}.<br>
      Caso houver dúvidas ou problemas, favor entrar em contato.</p>`
    } else {
      var html = `<td id="m_5802995636410960008m_-284055676835661507header-Logo-cta0a4e22de-622c-4c98-9dc7-25eb34d738f0" dir="ltr" style="padding:24px 24px 24px 30px" valign="top">
    <table style="max-width:600px;width:100%" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="left">
      <tbody>
        <tr>
          <td style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;padding-left:20px;font-size:14px;vertical-align:middle;width:99.6283%;text-align:right" align="left" valign="middle" width="300">
            <p>
              <img style="float:left" src="https://ci5.googleusercontent.com/proxy/wtAJkMQJwIRQipMHOw_9fyNG8lenQ-ZcvdDoENFMHNG04lMjrriYhIn3iEzYT0H3B5Ii0BhhsOlTiJDJ8wVLWQ=s0-d-e1-ft#https://conlinebr.com.br/logosirius_preta.png" alt="Google Cloud" width="154" height="61" class="CToWUd" data-bit="iit"></p>
          </td>
          <td style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;font-size:14px;vertical-align:middle;width:55.7621%;text-align:right;display:none" align="right" valign="middle" width="300">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="right">
              <tbody>
                <tr>
                  <td dir="ltr" style="border-radius:4px" align="right" bgcolor="#1a73e8">
                    <a style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;color:#ffffff;text-decoration:none;font-size:14px;letter-spacing:1px;font-weight:bold;border-radius:4px;border:1px solid #1a73e8;margin:0;padding:14px 16px 14px 16px;display:inline-block" href="https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo%3D&amp;source=gmail&amp;ust=1662742549311000&amp;usg=AOvVaw3926zLP6hdVgr1_zx3YlAy"></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
    
    <h4>Olá</h4>
  
    <p>Seu chamado se encontra em ${situacao}.<br>
    Programado para finalização na semana ${sprint}.</b><br>
    Em breve retornaremos com as atualizações.</p>`
    }
    
    
    async function main() {
      await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
          name: 'marketing@conline-news.com',
          host: 'mail.conline-news.com',
          service:'mail.conline-news.com',
          port: 465,
          maxMessages: 10,
          secure: true,
          pool:true,
          rateDelta:1000,
          rateLimit: 1000,
          auth:{
          user: 'marketing@conline-news.com',
          pass: 'conline191919aA@' },
          tls: {
            rejectUnauthorized: false
          },
          debug : true
          });
  
       // send mail with defined transport object
    await transporter.sendMail({
      from: 'TI ConLine <marketing@conline-news.com>', // sender address
      to: `${responsavel}`,
      cc: `ti@conlinebr.com.br`, // list of receivers
      subject: `💾 Chamado - Assunto: ${chamado}`, // Subject line
      html: `${html}`, // html body
    });
  }
  
    await main().catch(console.error);

    await NotificacaoAlterouSia();
    await res.json('Alterou')
})

app.post('/InsereFormularioChamado', async function (req, res) {
  await InsereSia(req.body);

  var chamado = req.body.assunto;
  var responsavel = req.body.responsavel;
  
  var html = `<td id="m_5802995636410960008m_-284055676835661507header-Logo-cta0a4e22de-622c-4c98-9dc7-25eb34d738f0" dir="ltr" style="padding:24px 24px 24px 30px" valign="top">
  <table style="max-width:600px;width:100%" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="left">
    <tbody>
      <tr>
        <td style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;padding-left:20px;font-size:14px;vertical-align:middle;width:99.6283%;text-align:right" align="left" valign="middle" width="300">
          <p>
            <img style="float:left" src="https://ci5.googleusercontent.com/proxy/wtAJkMQJwIRQipMHOw_9fyNG8lenQ-ZcvdDoENFMHNG04lMjrriYhIn3iEzYT0H3B5Ii0BhhsOlTiJDJ8wVLWQ=s0-d-e1-ft#https://conlinebr.com.br/logosirius_preta.png" alt="Google Cloud" width="154" height="61" class="CToWUd" data-bit="iit"></p>
        </td>
        <td style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;font-size:14px;vertical-align:middle;width:55.7621%;text-align:right;display:none" align="right" valign="middle" width="300">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="right">
            <tbody>
              <tr>
                <td dir="ltr" style="border-radius:4px" align="right" bgcolor="#1a73e8">
                  <a style="font-family:'Google Sans','Noto Sans JP',Arial,sans-serif;color:#ffffff;text-decoration:none;font-size:14px;letter-spacing:1px;font-weight:bold;border-radius:4px;border:1px solid #1a73e8;margin:0;padding:14px 16px 14px 16px;display:inline-block" href="https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo%3D&amp;source=gmail&amp;ust=1662742549311000&amp;usg=AOvVaw3926zLP6hdVgr1_zx3YlAy"></a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
  
  <h4>Olá</h4>

  <p>A equipe de TI recebeu seu chamado sobre: ${chamado}.<br>
  O mesmo se encontra em situação de <b>Backlog</b>.<br>
  Em breve retornaremos com as atualizações.</p>`
  
  async function main() {
    await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        name: 'marketing@conline-news.com',
        host: 'mail.conline-news.com',
        service:'mail.conline-news.com',
        port: 465,
        maxMessages: 10,
        secure: true,
        pool:true,
        rateDelta:1000,
        rateLimit: 1000,
        auth:{
        user: 'marketing@conline-news.com',
        pass: 'conline191919aA@' },
        tls: {
          rejectUnauthorized: false
        },
        debug : true
        });

     // send mail with defined transport object
  await transporter.sendMail({
    from: 'TI ConLine <marketing@conline-news.com>', // sender address
    to: `${responsavel}`,
    cc: `ti@conlinebr.com.br`, // list of receivers
    subject: `💾 Chamado - Assunto: ${chamado}`, // Subject line
    html: `${html}`, // html body
  });
}

await main().catch(console.error);

await NotificacaoInseriuSia();
await res.json('Inseriu')
})

  server.listen(port, () => {
    console.log(`Servidor web em: http://localhost:${port}`);
});

module.exports = {
    createWindow
}