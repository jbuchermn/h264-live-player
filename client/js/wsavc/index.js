var YUVWebGLCanvas = require('./canvas/YUVWebGLCanvas');
var YUVCanvas = require('./canvas/YUVCanvas');
var Size = require('./utils/Size');

// Requires lib/broadway/Decoder.js defining global Decoder

export default class Wsavc{
    constructor(canvas, onclose, {
        type,
        width,
        height
    }) {
        if(!width) throw "Need to supply width";
        if(!height) throw "Need to supply height";

        this._canvas = canvas;
        this._yuv = null;
        this._onclose = onclose || (() => null);

        this._config = {
            type: type || "webgl",
            width,
            height
        };

        this._decoder = new Decoder();
        this._setupCanvas();
        this._ws = null;
    }

    _setupCanvas() {
        this._canvas.width  = this._config.width;
        this._canvas.height = this._config.height;

        let canvasFactory = this._config.type == "webgl" ? YUVWebGLCanvas : YUVCanvas;
        this._yuv = new canvasFactory(this._canvas, new Size(this._config.width, this._config.height));

        this._decoder.onPictureDecoded = this._yuv.decode;
    }

    open(url) {
        if(this._ws) {
            this._ws.close();
            this._ws = null;
        }

        this._ws = new WebSocket(url);
        this._ws.binaryType = "arraybuffer";

        this._ws.onopen = () => {
            console.log("Connected to " + url);
        };

        this._ws.onclose = () => {
            running = false;
            console.log("WSAvcPlayer: Connection closed")
            this._onclose();
        };



        let framesList = [];
        let running = true;

        this._ws.onmessage = (evt) => {
            let frame = new Uint8Array(evt.data);
            framesList.push(frame);
        };


        let shiftFrame = () => {
            if(!running) return;

            if(framesList.length > 10) {
                console.log("Dropping frames", framesList.length);
                framesList = [];
            }

            let frame = framesList.shift();
            if(frame) this._decoder.decode(frame);

            requestAnimationFrame(shiftFrame);
        };


        shiftFrame();
    }


    close() {
        this._ws.close();
    }
};

