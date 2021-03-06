import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { signUp } from '../../actions/authActions'

class SignUp extends Component {



  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.signUp(this.state);
  }
  render() {
    const style = {
      width: '70%',
      margin: 'auto',
      marginTop: '200px',
      color: 'black'
    }
    const { auth, authError } = this.props;
    if (auth.uid) return <Redirect to='/' />
    return (
      <div className="container">
        <form className='card-panel white' style={style} onSubmit={this.handleSubmit}>
          <h5>Sign Up</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' onChange={this.handleChange} />
          </div>
          <div className="input-field" >
            <label htmlFor="password">Password</label>
            <input type="password" id='password' onChange={this.handleChange} />
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id='firstName' onChange={this.handleChange} />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id='lastName' onChange={this.handleChange} />
            </div>
          </div>
          <div className="input-field">
            <button>Sign Up</button>
            <div>
              {authError ? <p>{ authError }</p> : null }
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) =>{
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
