import React, {Component} from 'react'
import AudioVisualiser from './AudioVisualiser';

class OscAudioAnalyser extends Component {
    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
    }

    makeDistortionCurve( amount ) {
        let k = (typeof amount === 'number' ? amount : 0);
        let n_samples = 44100;
        let curve = new Float32Array(n_samples);
        let deg = Math.PI / 180;
        let x;

        for (let i = 0; i < n_samples; ++i ) {
          x = i * 2 / n_samples - 1;
          curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    }
  
    componentDidMount() {
        //initialize audio context node
        this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        //initialize oscillator node
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = this.props.waveType;
        this.oscillator.frequency.setValueAtTime(20, this.audioContext.currentTime); 

        //initialize osc gain node
        this.oscillatorGain = this.audioContext.createGain();
        this.oscillatorGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);

        //initialize distortion node
        this.distortion = this.audioContext.createWaveShaper();
        this.distortion.curve = this.makeDistortionCurve(0);

        //connect signal flow
        this.oscillator.connect(this.oscillatorGain);
        this.oscillatorGain.connect(this.distortion)
        this.distortion.connect(this.analyser)
        this.distortion.connect(this.audioContext.destination)
        this.oscillator.start();
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentDidUpdate(){
        //update controlled oscillator states
        this.oscillator.type = this.props.waveType;
        this.oscillator.frequency.setValueAtTime(this.props.freq, this.audioContext.currentTime);
        this.oscillatorGain.gain.setValueAtTime(this.props.gain, this.audioContext.currentTime);
        this.distortion.curve = this.makeDistortionCurve(this.props.dist);
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