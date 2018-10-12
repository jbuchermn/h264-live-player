import H264Stream from './wsavc'

import React from "react";
export default class App extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount(){
        this.stream = new H264Stream(this.canvasRef.current);
        this.stream.connect("ws://localhost:8080");
        setTimeout(()=>{
            this.stream.playStream();
        }, 5000);
    }

    render () {
        return <canvas ref={this.canvasRef} />;
    }
}
