import React from 'react'
import './layouts.scss'
import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav className='mb-1 navbar navbar-expand-lg navbar-dark bg-purple'>
    <Link className='navbar-brand' to='/'>Hightly</Link>
    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent-333'
      aria-controls='navbarSupportedContent-333' aria-expanded='false' aria-label='Toggle navigation'>
      <span className='navbar-toggler-icon'></span>
    </button>
    <div className='collapse navbar-collapse' id='navbarSupportedContent-333'>
      <ul className='navbar-nav mr-auto'>
        <li className='nav-item'>
          <a className='nav-link' href='https://github.com/Semreg/hightly'>Source</a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='https://github.com/Semreg/hightly/issues'>Issues</a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='https://github.com/Semreg/hightly/'>Donate</a>
        </li>
        <li className='nav-item dropdown'>
          <span className='nav-link dropdown-toggle' id='navbarDropdownMenuLink-333' data-toggle='dropdown'
            aria-haspopup='true' aria-expanded='false'><i className='fas fa-language'></i>
          </span>
          <div className='dropdown-menu dropdown-default' aria-labelledby='navbarDropdownMenuLink-333'>
            <span className='dropdown-item'>Not enabled yet</span>
            {/* <span className='dropdown-item'>Another action</span>
            <span className='dropdown-item'>Something else here</span> */}
          </div>
        </li>
      </ul>
      <ul className='navbar-nav ml-auto nav-flex-icons'>
        <li className='nav-item'>
          <a className='nav-link waves-effect waves-light' href='https://www.linkedin.com/in/vladislav-chabaniuk-792849159/' target='__black'>
            <i className='fab fa-linkedin'></i>
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link waves-effect waves-light' href='https://github.com/Semreg' target='__blank'>
            <i className='fab fa-github'></i>
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link waves-effect waves-light' href='https://gitlab.com/Semreg' target='__blank'>
            <i className='fab fa-gitlab'></i>
          </a>
        </li>
      </ul>
    </div>
  </nav>
)

export default Navbar
