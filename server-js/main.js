"use strict"
const NetcatServer    = require('./lib/netcat-server');

const http    = require('http');
const express = require('express');

const app  = express();

const server  = http.createServer(app);
const netcat = new NetcatServer(server,{
    width: 1280,
    height: 720,
    fps: 30
});

server.listen(8080);
