import React from 'react'
import AuthService from '../config/AuthService.js'
//import styles from './styles.module.css'

export class Home extends React.Component {


  render() {
    const { auth } = this.props

    return (
      <div>
        <p>Hello</p>

      </div>
    )
  }
}

export default Home;