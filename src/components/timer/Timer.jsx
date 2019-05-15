import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
// import Sound from 'react-sound';
import soundfile from '../../audio/the-little-dwarf.mp3';
import { connect } from 'react-redux';
import TimerList from './TimerList'
import { createTimer } from '../../actions/timerActions'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import dogBackground from '../../assets/images/dogBackground.jpg'


class Timer extends Component {
  constructor(props){
    super(props)
    this.state = {
      time: 0,
      timer: null,
      count: 1,
      display: null,
      stop: false,
      stopButton: null,
      formattedTime: '25:00',
      audio: true,
      workGif: null,
    }
    this.updateTimer = this.updateTimer.bind(this);
    // this.componentWillMount = this.componentWillMount.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.checkPause = this.checkPause.bind(this);
    this.addZeros = this.addZeros.bind(this);
    this.getNewGiphy = this.getNewGiphy.bind(this);
  }

  componentWillMount() {
    const setTime = new Moment.duration(25, 'minutes');
    this.setState({time: setTime});
    let newDisplay = <div><button className="waves-effect waves-light btn-large blue darken-3" type='button' onClick={() => this.startTimer(5)}>Start Focusing</button></div>
    this.setState({display: newDisplay})
    let newAudio = new Audio(soundfile);
    this.setState({audio: newAudio});
    // this.getNewGiphy();
  }

  getNewGiphy(typeOfGif) {
    const giphyKey = process.env.REACT_APP_API_KEY;
    let pupWork = null;
    let url = `https://api.giphy.com/v1/gifs/random?api_key=${giphyKey}&tag=${typeOfGif}&rating=PG`;
    fetch(url).then(response => response.json()).then(
      (json) => {
        let pupWork = json.data.image_url;
        this.setState({workGif: pupWork})
      }
    )
  };

  updateTimer() {
    // console.log(this.state.time)
    let newTime = this.state.time.subtract(1, 'seconds');
    let newDisplay;
    this.setState({time: newTime});
    this.addZeros(this.state.time._data.minutes, this.state.time._data.seconds);
    setInterval(this.checkPause, 1000);
    if (this.state.time._data.minutes === 0 && this.state.time._data.seconds === 0) {
      this.muteAlarm();
      clearInterval(this.state.timer)
      let newCount = this.state.count + 1;
      this.setState({count: newCount});
      if (this.state.count % 8 === 0) {
        newDisplay = <div><button className="waves-effect waves-light btn-large blue darken-3" type='longBreakButton' onClick={() =>    {this.startBreak(10); this.setState({display: null});}}>Long Break </button></div>
        this.setState({display: newDisplay})
        console.log('long break');
        this.getNewGiphy('work%20puppy%20dog')
      }
      else if (this.state.count % 2 === 0) {
        this.getNewGiphy('relax%20puppy%20dog')
        newDisplay = <div><button className="waves-effect waves-light btn-large blue darken-3" type='button' onClick={() => {this.startBreak(5); this.setState({display: null});}}>Short Break</button></div>
        this.setState({display: newDisplay})
        console.log('short break');
      } else {
        newDisplay = <div><button className="waves-effect waves-light btn-large blue darken-3" type='button' onClick={() => {this.startTimer(5); this.setState({display: null});}}>Start Focusing</button></div>
        this.setState({display: newDisplay})
        console.log('focus');
        this.getNewGiphy('work%20puppy%20dog')

      }
    }
    if (this.state.stop === false) {
      let pauseButton = <div><button className="waves-effect waves-light btn-small orange lighten-1" type='button' onClick={() => {
          this.setState({stop: true});
          clearInterval(this.state.timer);
        }}>Pause</button></div>
      this.setState({stopButton: pauseButton});
    }
  }

  checkPause() {
    if (this.state.stop === false) {
      let pauseButton = <div><button className="waves-effect waves-light btn-small orange lighten-1" type='button' onClick={() => {
          this.setState({stop: true});
          clearInterval(this.state.timer);
        }}>Pause</button></div>
      this.setState({stopButton: pauseButton});
    } else if (this.state.stop === true) {
      let resumeButton = <div><button className="waves-effect waves-light btn-small orange lighten-1" type='button' onClick={() => {
          this.setState({stop: false});
          let resumeTimer = setInterval(this.updateTimer, 1000);
          this.setState({timer: resumeTimer})
        }}>Resume</button></div>
      this.setState({stopButton: resumeButton});
    }
    if (this.state.time._data.minutes === 0 && this.state.time._data.seconds === 0) {
      let stopDisplay = null;
      this.setState({stopButton: stopDisplay});
    }

  }

  muteAlarm(){
    let song = new Audio(soundfile);
    if(this.state.audio) {
      console.log(song.play())
    }
    else if (!this.state.audio){
      console.log('sound is off')
    }
  }

  startTimer(number, date) {
    let updateFormattedTime = number + ":00";
    this.setState({formattedTime: updateFormattedTime});
    const setTime = new Moment.duration(number, 'seconds');
    date = new Date();
    this.setState({time: setTime})
    this.setState({display: null})
    // console.log(this.state.time)
    let timerStart = setInterval(() => {
      this.updateTimer()
    },1000)
    this.setState({timer: timerStart});
    this.props.createTimer(number, date);
    this.setState({workGif:null})
  }

  startBreak(number) {
    let updateFormattedTime = number + ":00";
    this.setState({formattedTime: updateFormattedTime});
    const setTime = new Moment.duration(number, 'seconds');
    this.setState({time: setTime})
    // console.log(this.state.time)
    let timerStart = setInterval(() => {
      this.updateTimer()
    },1000)
    this.setState({timer: timerStart})
  }

  addZeros(m,s){
    let newFormattedTime = ("0"+m).substr(-2) + ":" +("0"+s).substr(-2);
    this.setState({formattedTime: newFormattedTime})
  }

  render() {
    const { timers, auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />
    var center = {
      textAlign: 'center',
      width: '80%',
      margin: 'auto',
    }
    var timer = {
      fontFamily: 'Baloo Bhai',
      fontSize: '20vw',
    }
    var buttonFormat = {
      marginTop: '15px',
    }
    var backgroundDog = {
      backgroundImage: `url(${dogBackground})`,
      width: '100%',
      height: '90vh',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      }
    var gifStyle = {
      display: 'flex',
      minHeight: '150px',
      minWidth: '150px',
      maxHeight: '400px',
      maxWidth: '400px',
      justifyContent: 'center',
      margin: 'auto',
      marginTop: '2vh',
    }
    var imgStyle = {
      borderRadius: '5px',
    }

    let picture;
    if (this.state.workGif) {
      picture = <div style={gifStyle}>
        <img className='z-depth-3' style={imgStyle} src={this.state.workGif} />
      </div>
    } else {
      picture = null; }

    return(
      <div style={backgroundDog}>
        <div className="card-panel teal lighten-2" style={center}>
          <div style={buttonFormat}>
            <div style={timer}>
              {this.state.formattedTime}
            </div>
          </div>
          <div style={buttonFormat}>
            {this.state.display}
          </div>
          <div style={buttonFormat}>
            {this.state.stopButton}
          </div>
          <div style={buttonFormat}>
          </div>
            <button style={buttonFormat} className= "waves-effect waves-light btn-small green" type='button' onClick={() => {
                let audioPref = !this.state.audio;
                this.setState({audio: audioPref})}}>Toggle Sound</button>
              {picture}
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    timers: state.firestore.ordered.timers,
    auth: state.firebase.auth
  }
}
const mapDispatchToProps = (dispatch) =>{
  return {
    createTimer: (timer, date) => dispatch(createTimer(timer, date))
  }
}

export default compose(
  connect (mapStateToProps, mapDispatchToProps),
  firestoreConnect([{
    collection: 'timers'
  }])
)(Timer);

// { if (this.state.workGif !== null) {}
//   if (this.state.workGif != null) {
//   return <div style={gifStyle}>
//     <img className='z-depth-5' style={imgStyle} src={this.state.workGif} />
//   </div>
// }

// <div>
//   <TimerList timers={timers} />
// </div>
