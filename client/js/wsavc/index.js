var YUVWebGLCanvas = require('./canvas/YUVWebGLCanvas');
var YUVCanvas = require('./canvas/YUVCanvas');
var Size = require('./utils/Size');

// Requires lib/broadway/Decoder.js defining global Decoder

export default class Wsavc{
    constructor(canvas) {

        console.log(canvas);
        this._canvas = canvas;
        this._canvastype = "webgl";

        // AVC codec initialization
        this._decoder = new Decoder();
        console.log("Created decoder instance");

        //WebSocket variable
        this._ws;
        this._pktnum = 0;
    }

    connect(url) {

        // Websocket initialization
        if(this.ws) {
            this.ws.close();
            delete this.ws;
        }
        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";

        this.ws.onopen = () => {
            console.log("Connected to " + url);
        };


        var framesList = [];

        this.ws.onmessage = (evt) => {
            if(typeof evt.data == "string")
                return this.cmd(JSON.parse(evt.data));

            this.pktnum++;
            var frame = new Uint8Array(evt.data);
            framesList.push(frame);
        };


        var running = true;

        var shiftFrame = function() {
            if(!running)
                return;

            if(framesList.length > 10) {
                console.log("Dropping frames", framesList.length);
                framesList = [];
            }

            var frame = framesList.shift();

            if(frame){
                this._decoder.decode(frame);
            }

            requestAnimationFrame(shiftFrame);
        }.bind(this);


        shiftFrame();

        this.ws.onclose = () => {
            running = false;
            console.log("WSAvcPlayer: Connection closed")
        };

    }

    cmd(cmd){
        console.log("Incoming request", cmd);

        if(cmd.action == "init") {
            var canvasFactory = this._canvastype == "webgl" ? YUVWebGLCanvas : YUVCanvas;

            var canvas = new canvasFactory(this._canvas, new Size(cmd.width, cmd.height));
            this._decoder.onPictureDecoded = canvas.decode;
            this._canvas.width  = cmd.width;
            this._canvas.height = cmd.height;
        }
    }

    disconnect() {
        this.ws.close();
    }

    playStream() {
        var message = "REQUESTSTREAM ";
        this.ws.send(message);
        console.log("Sent " + message);
    }

    stopStream() {
        var message = "STOPSTREAM ";
        this.ws.send(message);
        console.log("Sent " + message);
    }
};

