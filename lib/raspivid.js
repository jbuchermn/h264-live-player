"use strict";

const util      = require('util');
const spawn     = require('child_process').spawn;
const merge     = require('mout/object/merge');

const Server    = require('./_server');


class RpiServer extends Server {

    constructor(server, opts) {
        super(server, merge({
            fps : 12,
        }, opts));
    }

    get_feed() {
        console.log("Spawning")
        var streamer = spawn('nc', ['172.16.0.105', '5001']);
        streamer.on("exit", function(code){
            console.log("Failure", code);
        });

        return streamer.stdout;
    }

};



module.exports = RpiServer;
