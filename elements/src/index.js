import React from 'react'
import ReactDOM from 'react-dom'
import './home/framework/lib/config/app-config.css'
import './home/framework/lib/dist/react-windows-ui.min.css'
import './home/framework/lib/icons/fonts/fonts.min.css'
import App from './home/App'

const network = 'usertoken'

ReactDOM.render(
  <React.StrictMode>
    <App network={network}/>
  </React.StrictMode>,
  document.getElementById('root')
);