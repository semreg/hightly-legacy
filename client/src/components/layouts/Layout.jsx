import React from 'react'
import Navbar from './Navbar'
import { node } from 'prop-types'

const propTypes = { children: node }

const Layout = ({ children }) => (
  <>
    <div className='container'>
      <Navbar />
      {children}
    </div>
  </>
)

Layout.propTypes = propTypes

export default Layout
