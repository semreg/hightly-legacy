import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }) => (
  <>
    <div className="container">
      <Navbar />
      {children}
    </div>
  </>
)

export default Layout
