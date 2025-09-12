import { Fragment } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import CallApp from './components/CallApp'
import SignIn from './Auth/SignIn'
import SignUp from './Auth/SignUp'

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/callapp" element={<CallApp />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
