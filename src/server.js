const { BrowserWindow, Notification } = require("electron");
const {getConnection} = require('./database');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);

const port = 9000;

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

server.listen(port, () => {
    console.log(`Servidor web em execução: http://localhost:${port}`);
});

module.exports = {
    createWindow
}