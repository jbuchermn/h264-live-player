"use strict"
const NetcatServer    = require('./lib/netcat-server');

const http    = require('http');
const express = require('express');

const app  = express();

  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));

const server  = http.createServer(app);
const netcat = new NetcatServer(server,{
    width: 1280,
    height: 720,
    fps: 30
});

server.listen(8080);
