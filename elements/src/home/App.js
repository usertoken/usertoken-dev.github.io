import React from 'react'
import Framework from './framework/home'
import Blogpage from './framework/index'

const peers = [`${window.location.protocol}//${window.location.host}/gun`];
const showFramework = true;

const App = props => {
  console.log('1.app pros:',props);
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
