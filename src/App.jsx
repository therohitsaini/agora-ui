import { Fragment } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import CallApp from './components/CallApp'
import SignIn from './Auth/SignIn'
import SignUp from './Auth/SignUp'
import CallNotification from './components/CallNotification'
import BookAppointment from './Dashbord/Pages/BookAppointment'
import AppNavbar from './DashbordComponents/DashbordPages/AppBarDashbord'
import DashbordHome from './DashbordComponents/DashbordHome/DashbordHome'
import Anlaylics from './DashbordComponents/DashbordPages/Anlaylics'



function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/callapp" element={<CallApp />} />
          <Route path="/callnotification" element={<CallNotification />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/appbardashbord" element={<AppNavbar />} />
          <Route path='/dashbord-home' element={<DashbordHome />} />
          <Route path='/anaysics' element={<Anlaylics />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
