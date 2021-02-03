import React, {useState} from 'react';
import MicAudioAnalyser from './MicAudioAnalyser';
import OscAudioAnalyser from './OscAudioAnalyser';
import Slider from 'react-input-slider';
import BarGraphVisualiser from './BarGraphVisualiser';

function App() {
  const [audioState, setAudioState] = useState(null)
  const [waveType, setWaveType] = useState('sine')
  const [oscFreq, setOscFreq] = useState(27.5)
  const [slidePos, setSlidePos] = useState({x: 0})
  const [gain, setGain] = useState(0.5)
  const [distortion, setDistortion] = useState(0)

  // console.log(audioState)
  // console.log(waveType)
  // console.log(slidePos)
  // console.log(oscFreq)
  // console.log(gain)
  console.log(distortion)

  const twelfthTwo = Math.pow(2, 1/12)

  const getMicrophone = async () => {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
    setAudioState(audio)
  }

  const stopMicrophone = () => {
    audioState.getTracks().forEach(track => track.stop());
    setAudioState(null);
  }

  const toggleMicrophone = () => {
    if (audioState !== null) {
      console.log("microphone off!")
      stopMicrophone();
    } else {
      console.log("microphone on!")
      getMicrophone();
    }
  }

  const toggleWaveType = () => {
    if(waveType === 'sine'){
      setWaveType('sawtooth')
    }else{
      setWaveType('sine')
    }
  }

  const changeSlidePos = (x) => {
    setSlidePos(x)
    const newFreq = Math.round(27.5 * Math.pow(twelfthTwo, x.x))
    setOscFreq(newFreq)
  }

  const handleSetDistortion = (x) => {
    console.log(x)
    setDistortion(x)
  }
  
  return(
    <div className="App">
      <main>
        <div className="controls">
          <button onClick={toggleMicrophone}>
            {audioState ? 'Stop microphone' : 'Get microphone input'}
          </button>
          <button onClick={toggleWaveType}>
            Change Waveform to {(waveType === 'sine') ? 'sawtooth' : 'sine'}
          </button>
          <br></br>
          Frequency Slider
          {audioState ? <Slider axis="x" xstep={1} xmin={0} xmax={88} x={slidePos.x} onChange={x => changeSlidePos(x)} /> : ''}
          <br></br>
          Gain Slider
          {audioState ? <Slider axis="x" xstep={0.1} xmin={0} xmax={1} x={gain} onChange={({ x }) => setGain(x)} /> : ''}
          <br></br>
          Distortion Slider
          {audioState ? <Slider axis="x" xstep={1} xmin={0} xmax={100} x={distortion} onChange={({ x }) => handleSetDistortion(x)} /> : ''}
        </div>
        {audioState ? <MicAudioAnalyser audio={audioState} /> : ''}
        {audioState ? <BarGraphVisualiser audio={audioState} /> : ''}
        {audioState ? <OscAudioAnalyser waveType={waveType} freq={oscFreq} gain={gain} dist={distortion} /> : ''}
      </main>
    </div>
  );
}

export default App;
