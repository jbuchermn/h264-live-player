export default class MJPEGplayer{
    constructor(canvas, onclose, {
        width,
        height
    }) {
        if(!width) throw "Need to supply width";
        if(!height) throw "Need to supply height";

        this._context = canvas.getContext('2d');
        this._onclose = onclose || (() => null);

        this._config = {
            width,
            height
        };

        canvas.width  = this._config.width;
        canvas.height = this._config.height;
        this._ws = null;
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
            console.log("MJPEGplayer: Connection closed")
            this._onclose();
        };

        let img = new Image()
        let imgUrl = null;
        let start = [];

        img.onload = () => {
            let s = start.shift();
            console.log(new Date() - s);
            this._context.drawImage(img, 0, 0);
            (URL || webkitURL).revokeObjectURL(imgUrl);
        }

        const show = function (jpeg) {
            let blob = new Blob([jpeg], {type: "image/jpeg"});
            imgUrl = (URL || webkitURL).createObjectURL(blob);
            img.src = imgUrl;
        }


        let framesList = [];
        let running = true;

        this._ws.onmessage = (evt) => {
            start.push(new Date());
            let frame = new Uint8Array(evt.data);
            framesList.push(frame);
        };


        let shiftFrame = () => {
            if(!running) return;

            while(framesList.length > 3) framesList.shift();
            let frame = framesList.shift();
            if(frame) show(frame);

            requestAnimationFrame(shiftFrame);
        };


        shiftFrame();
    }


    close() {
        this._ws.close();
    }
};

