import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as morgan from 'morgan';
import { logger, stream } from './config/winston';
import * as appRoot from 'app-root-path'

const lspbin = `${appRoot}/../lsp/bin/computational-modeling-language-server-stdio`

var port = 7999
var compmod2 = false

if (process.argv.includes("compmod2")) {
    port = 6999
    compmod2 = true
}

if (process.argv.includes("debug")) {
	console.log('\x1b[31m', 'Running in Debug mode.', '\x1b[0m')
    if (compmod2) {
        port = 5999
    } else {
        port = 8999
    }
    
}


const app = express();

app.use(morgan('combined', { stream: stream }));

logger.info(`WSLSP Server Starting`)

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const { spawn } = require('child_process');


wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {

    logger.info(`New WS Connection from ${req.connection.remoteAddress}`)

    // spawn a LSP for the connectiond
    const child = spawn(lspbin);
    child.on('error', (err: Error) => {
        logger.error(`Child process error: ${err.message}`)
        ws.close()
    });

    child.on('exit', (code:number, signal:string) => {
        logger.info(`Child process exited with code ${code} and signal ${signal}`)
        ws.close()
    });

    // on data received from the LSP application
    child.stderr.on('data', (data: Buffer) => {
        var s:string
        s = data.toString()
	    console.error('dataerr')
	    console.error(s)
    });

    // on data received from the LSP application
    child.stdout.on('data', (data: Buffer) => {
        var s:string
        s = data.toString()
        var i = s.indexOf('\r\n\r\n')
        if (i>0) {
            s = s.substring(i+4)
        }
	try {
		JSON.parse(s)
	} catch (e) {
		return
	}
        ws.send(s)
    });

    // on message received
    ws.on('message', (message: string) => {

        //log the received message and forward it to the LSP
        var mlen: number
        mlen = message.length
        child.stdin.write('Content-Length: ' + mlen.toString() + '\r\n\r\n')
        child.stdin.write(message)
    });

    ws.on('close', () => {
      logger.info(`Connection closed. Terminating LSP`)
      child.kill()
    })

    ws.on('error', (err) => {
        logger.error(`Connection error: ${err.message}. Terminating LSP`)
        child.kill()
    })

});

wss.on('error', (err) => {
    logger.error(`WebSocketServer Error: ${err.message}.`)
})

//start our server
server.listen(process.env.PORT || port, () => {
    logger.info(`Server started on port ${port}.`);
});
