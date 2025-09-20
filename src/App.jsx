import { Fragment } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import CallApp from './components/CallApp'
import SignIn from './Auth/SignIn'
import SignUp from './Auth/SignUp'
import CallNotification from './components/CallNotification'
import Demo from './components/demo'

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/callapp" element={<CallApp />} />
          <Route path="/callnotification" element={<CallNotification />} />
          <Route path="/vc-call" element={<Demo/>} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
