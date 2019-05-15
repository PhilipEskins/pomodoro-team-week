import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../actions/authActions'

const SignedInLinks = (props) => {

  return (
    <div>
      <ul className="right">
        <li><a onClick={props.signOut}>Log Out</a></li>
        <li><NavLink to='/profile'>{props.profile.initials}</NavLink></li>
      </ul>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks)


// <li><NavLink to='/create'>New Timer</NavLink></li>
