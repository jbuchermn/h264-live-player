"use strict"
const NetcatServer    = require('./lib/netcat-server');

const http    = require('http');
const express = require('express');

const app  = express();

const server  = http.createServer(app);
const netcat = new NetcatServer(server,{
    width: 1024,
    height: 576
});

server.listen(8080);
