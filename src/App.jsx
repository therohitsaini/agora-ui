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
import { AllUserProvider } from './DashbordComponents/ApiContext/ApiContextUserData'
import Client from './DashbordComponents/DashbordPages/Client'
import ConsultantRoot from './DashbordComponents/DashboardRootPages/ConsultantRoot'
import ConsultantTable from './DashbordComponents/DashbordPages/ConsultantTable'
import Overview from './DashbordComponents/DashbordPages/Overview'
import AddConsultantForm from './DashbordComponents/DashbordPages/AddConsultantForm'

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

            {/* Nasted Dashboard Route */}
            <Route path="/dashboard" element={<DashbordHome />}>
              <Route path="home" element={<HomeContent />} />
              <Route path="analytics" element={<Anlaylics />} />
              <Route path='consultant' element={<AddConsultantForm />} />
              <Route path='clients' element={<Client />} />
              <Route path='consultant-root' element={<ConsultantRoot />} />
              <Route path='consultant-table' element={<ConsultantTable />} />
              <Route path='overview' element={<Overview />} />
              <Route index element={<Navigate to="home" replace />} />
              {/* Nasted Dashboard Route End */}
            </Route>
          </Routes>
        </AllUserProvider>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
