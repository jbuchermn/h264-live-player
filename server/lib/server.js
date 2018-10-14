"use strict";

const WebSocketServer = require('ws').Server;
const Splitter        = require('stream-split');

const NAL_SEP    = new Buffer([0,0,0,1]);//NAL break


class Server {

    constructor(server, options) {
        if(!options.width) throw "Need to supply width";
        if(!options.height) throw "Need to supply height";

        this.options = options;

        this.wss = new WebSocketServer({ server });
        this.wss.on('connection', this.new_client.bind(this));

        this.feed = null;
    }

    get_feed() {
        throw "Abstract method";
    }

    new_client(socket) {
        console.log('New connection');

        this.start_feed();
        socket.on('close', () => {
            this.feed.end();
            this.feed = null;
            console.log('Connection closed');
        });
    }


    start_feed() {
        if(this.feed) return;

        let feed = this.get_feed();
        this.feed = feed.pipe(new Splitter(NAL_SEP));

        this.feed.on("data", (data) => {
            this.wss.clients.forEach((socket) => {
                socket.send(Buffer.concat([NAL_SEP, data]), { binary: true }, (error) => {});
            });

        });
    }


};


module.exports = Server;
