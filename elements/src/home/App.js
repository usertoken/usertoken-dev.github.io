import React from 'react'
import Framework from './framework/home'
import Blogpage from './framework/index'

const showFramework = true;

function App() {
  if (showFramework)
  return (
    <>
      <Framework title='Usertoken' homepage='/home' />
    </>
  )
  else {
    return (
      <>
        <Blogpage title='Usertoken' homepage='/home' />
      </>
    )
  }
}

export default App
