import { Fragment } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CallApp from './components/CallApp'
import SignIn from './Auth/SignIn'
import SignUp from './Auth/SignUp'
import CallNotification from './components/CallNotification'
import BookAppointment from './Dashbord/Pages/BookAppointment'
import AppNavbar from './DashbordComponents/DashbordPages/AppBarDashbord'
import DashbordHome from './DashbordComponents/DashbordHome/DashbordHome'
import Anlaylics from './DashbordComponents/DashbordPages/Anlaylics'
import HomeContent from "./DashbordComponents/DashbordPages/HomeContent"
import Consaltant from './DashbordComponents/DashbordPages/Consaltant'
import { AllUserProvider } from './DashbordComponents/ApiContext/ApiContextUserData'
import Client from './DashbordComponents/DashbordPages/Client'

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <AllUserProvider>
          <Routes>
            {/* Auth & misc routes */}
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/callapp" element={<CallApp />} />
            <Route path="/callnotification" element={<CallNotification />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/appbardashbord" element={<AppNavbar />} />

            {/* 🧠 DASHBOARD layout with nested pages */}
            <Route path="/dashboard" element={<DashbordHome />}>
              <Route path="home" element={<HomeContent />} />
              <Route path="analytics" element={<Anlaylics />} />
              <Route path='consultant' element={<Consaltant />} />
              <Route path='clients' element={<Client />} />
              <Route index element={<Navigate to="home" replace />} />
            </Route>
          </Routes>
        </AllUserProvider>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
