"use strict"
const util      = require('util');
const spawn     = require('child_process').spawn;
const merge     = require('mout/object/merge');

const Server    = require('./lib/_server');
const RpiServer = require('./lib/raspivid')


class NetcatServer extends Server {

    constructor(server, opts) {
        super(server, merge({
            fps : 12,
        }, opts));
    }

    get_feed() {
        var streamer = spawn('nc', ['172.16.0.105', '5001']);
        streamer.on("exit", function(code){
            console.log("Failure", code);
        });

        return streamer.stdout;
    }

};

/**
* Run this on a raspberry pi 
* then browse (using google chrome/firefox) to http://[pi ip]:8080/
*/


const http    = require('http');
const express = require('express');


const app  = express();

  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));

const server  = http.createServer(app);
const silence = new RpiServer(server);

server.listen(8080);
