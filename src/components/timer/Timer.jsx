import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';


class Timer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      time: null,
    }
    this.updateTimer = this.updateTimer.bind(this);
  }

  updateTimer() {
    let newTime = this.state.time.subtract(1, 'seconds');
    this.setState({time: newTime})
  }

  componentWillMount() {
    const setTime = new Moment.duration(25, 'minutes');
    this.setState({time: setTime});
    this.state.time = setInterval(() =>
      this.updateTimer(), 1000
    );

  }



  render() {
    return(
      <div>
        <h1>Timer works</h1>
        {this.state.time._data.minutes} : {this.state.time._data.seconds}
      </div>
    );
  }
}

export default Timer;
