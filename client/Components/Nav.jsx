import React from 'react';
import RoomList from './RoomList.jsx'


export class Nav extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // Initialize collapse button
    $(".button-collapse").sideNav({
      menuWidth: 400,
      closeOnClick: true
    });
  }

  render() {

    return (
      <nav className="splash-nav blue darken-3">
        <ul id="slide-out" className="side-nav">
          <nav className="splash-nav blue darken-3">
            <div className="nav-wrapper valign-wrapper">
            </div>
          </nav>
          <RoomList roomSelect={this.props.roomSelect}/>
          <footer className="center-align">
          </footer>
        </ul>

        <div className="nav-wrapper">
          <a href="/" className="breadcrumb"> Interviewer DC</a>
          <a href="#" className={ this.props.room ? 'breadcrumb show' : 'hide' }>{this.props.room}</a>
          <ul className="right">
            <li>
              <a className='dropdown-button breadcrumb' href='#' data-activates='sign-out-dropdown' data-hover='true' data-belowOrigin='true'>Hello, {this.props.name}!</a>

              <ul id='sign-out-dropdown' className='dropdown-content'>
                <li><a href="/logout"><span className="glyphicons glyphicons-log-out"></span>Sign Out</a></li>
              </ul>
            </li>
          </ul>
          <a href="#" data-activates="slide-out" className={ !this.props.room ? 'button-collapse left show' : 'hide' }>
            <span data-activates="slide-out" className="glyphicons glyphicons-menu-hamburger"></span>
          </a>

        </div>
      </nav>
    )
  }
}

export default Nav;


// const Nav = ({name, room, roomSelect}) => (
//
//   <nav className="splash-nav blue darken-3">
//     <ul id="slide-out" className="side-nav">
//       <nav className="splash-nav blue darken-3">
//         <div className="nav-wrapper valign-wrapper">
//         </div>
//       </nav>
//       <RoomList roomSelect={roomSelect}/>
//       <footer className="center-align">
//       </footer>
//     </ul>
//
//     <div className="nav-wrapper">
//       <a href="/" className="breadcrumb"> Interviewer DC</a>
//       <a href="#" className={ room ? 'breadcrumb show' : 'hide' }>{room}</a>
//       <ul className="right">
//         <li>
//           <a className='dropdown-button breadcrumb' href='#' data-activates='sign-out-dropdown' data-hover='true' data-belowOrigin='true'>Hello, {name}!</a>
//
//           <ul id='sign-out-dropdown' className='dropdown-content'>
//             <li><a href="/logout"><span className="glyphicons glyphicons-log-out"></span>Sign Out</a></li>
//           </ul>
//         </li>
//       </ul>
//       <a href="#" data-activates="slide-out" className="left">
//         <span data-activates="slide-out" className="glyphicons glyphicons-menu-hamburger"></span>
//       </a>
//
//     </div>
//   </nav>
// )
//
// module.exports = Nav;
