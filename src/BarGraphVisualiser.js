import React, { Component } from 'react'

class BarGraphVisualiser extends Component {
    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.source = this.audioContext.createMediaStreamSource(this.props.audio);
        this.source.connect(this.analyser);
        this.rafId = requestAnimationFrame(this.tick);
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentDidUpdate() {
        this.draw();
    }

    draw(){
        const canvas = this.canvas.current;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);

        this.analyser.getByteFrequencyData(this.dataArray);

        context.fillStyle = 'rgb(0, 0, 0)';
        context.fillRect(0, 0, width, height);

        let barWidth = (width/ this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(var i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i]/2;
    
            context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            context.fillRect(x,height-barHeight/2,barWidth,barHeight);
    
            x += barWidth + 1;
        }
    }
  
    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    render() {
        return <canvas width="300" height="300" ref={this.canvas} />;
    }
}

export default BarGraphVisualiser;