import React, {Component} from 'react'
import AudioVisualiser from './AudioVisualiser';

class OscAudioAnalyser extends Component {
    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
    }
  
    componentDidMount() {
        this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = this.props.waveType;
        this.oscillator.frequency.setValueAtTime(20, this.audioContext.currentTime); 

        this.oscillatorGain = this.audioContext.createGain();
        this.oscillatorGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);

        this.oscillator.connect(this.oscillatorGain);
        this.oscillatorGain.connect(this.analyser)
        this.oscillatorGain.connect(this.audioContext.destination)
        this.oscillator.start();
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentDidUpdate(){
        this.oscillator.type = this.props.waveType;
        this.oscillator.frequency.setValueAtTime(this.props.freq, this.audioContext.currentTime);
        this.oscillatorGain.gain.setValueAtTime(this.props.gain, this.audioContext.currentTime);
    }
  
    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }
  
    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.oscillator.stop();
    }
  
    render() {
        return(
            <div>
                <AudioVisualiser audioData={this.state.audioData} />
            </div>
        );
    }
  }
  

export default OscAudioAnalyser;