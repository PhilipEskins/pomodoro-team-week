import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'

const Navbar = (props) => {
  const { auth, profile } = props;
  const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />
  var topRight = {
    position: 'fixed',
    right: '50px',
    top: '3px'
  }
  var center = {
    textAlign: 'center',
    fontSize: '40px',
    position: 'fixed',
    top: '0px',
  }
  var fixed = {
    position: 'fixed'
  }
  return (
    <nav style={center}>
      <div >
        <div className="container header">
            <Link to='/' className="">PomoDogo</Link>
        </div>
      </div>
      <div style={topRight}>
        { links }
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}


export default connect(mapStateToProps)(Navbar)

//container
