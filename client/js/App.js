import WSAvc from './wsavc'
import MJPEGplayer from './MJPEGplayer'

import React from "react";
export default class App extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount(){
        this.stream = new MJPEGplayer(this.canvasRef.current, () => {
            console.log("Closed");
        },{
            type: "webgl",
            width: 640,
            height: 480
        });
        this.stream.open("ws://172.16.0.105:5001");
    }

    render () {
        return <canvas ref={this.canvasRef} />;
    }
}
