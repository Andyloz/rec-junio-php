import React from 'react'
import Header from './Header'
import Main from './Main'

const Layout = () => {
  return (
    <div className='vh-100 d-flex flex-column'>
      <Header />
      <Main />
    </div>
  )
}

export default Layout