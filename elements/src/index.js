import React from 'react'
import ReactDOM from 'react-dom'
import './home/framework/lib/config/app-config.css'
import './home/framework/lib/dist/react-windows-ui.min.css'
import './home/framework/lib/icons/fonts/fonts.min.css'
import App from './home/App'
import { database } from './nautilus/lib/database'
import Nautilus from './nautilus/index';

// const network = 'usertoken'
const network = Nautilus()
const {db} = database()
db.loadDatabase()
// console.log('1.nautilus db collections : ',db.listCollections())
const secrets = db.getCollection('secrets');
secrets.flushChanges()
// console.log('2.nautilus secrets: ',secrets.count)
// const data = secrets ? secrets.findOne({}).data : nautilusNetwork.data
const data = secrets.findOne({}).data

ReactDOM.render(
  <React.StrictMode>
    <App network={network}/>
  </React.StrictMode>,
  document.getElementById('root')
);