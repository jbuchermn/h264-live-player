import WSAvc from './wsavc'

import React from "react";
export default class App extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount(){
        this.stream = new WSAvc(this.canvasRef.current, () => {
            console.log("Closed");
        },{
            type: "webgl",
            width: 1280,
            height: 720
        });
        this.stream.open("ws://localhost:8080");
    }

    render () {
        return <canvas ref={this.canvasRef} />;
    }
}
