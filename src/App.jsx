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
import AddConsultantForm from './DashbordComponents/DashbordPages/AddConsultantForm'
import Overview from './Utils/Overview'
import { AuthProvider } from './authProvider/AuthProvider'
import ProtectRoute from './authProvider/ProtectRoute'
import PublicRoute from './authProvider/PublicRoute'
import AdminRoute from './authProvider/AdminRoute'
import ConsultantHome from './ConsultantDashboard/ConsultantHome'

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <AuthProvider>
          <AllUserProvider>
            <Routes>
              <Route path="/"
                element={
                  <PublicRoute>
                    <SignIn />
                  </PublicRoute>
                }
              />
              <Route path="/signup"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />
              <Route
                path="/callapp"
                element={
                  <ProtectRoute>
                    <CallApp />
                  </ProtectRoute>
                } />

              <Route path="/callnotification"
                element={
                  <ProtectRoute>
                    <CallNotification />
                  </ProtectRoute>
                } />
              <Route path="/book-appointment"
                element={
                  <ProtectRoute>
                    <BookAppointment />
                  </ProtectRoute>
                } />
              <Route path="/appbardashbord"
                element={
                  <ProtectRoute>
                    <AppNavbar />
                  </ProtectRoute>
                } />


              <Route path="/dashboard"
                element={
                  <AdminRoute>
                    <DashbordHome />
                  </AdminRoute>
                }>
                {/* Nasted Dashboard Route start */}
                <Route path="home" element={<HomeContent />} />
                <Route path="analytics" element={<Anlaylics />} />
                <Route path='consultant' element={<AddConsultantForm />} />
                <Route path='clients' element={<Client />} />
                <Route path='consultant-root' element={<ConsultantRoot />} />
                <Route path='consultant-table' element={<ConsultantTable />} />
                <Route path='overview' element={<Overview />} />
                <Route path='consultant-home' element={<ConsultantHome />} />
                <Route index element={<Navigate to="home" replace />} />
                {/* Nasted Dashboard Route End */}
              </Route>
            </Routes>
          </AllUserProvider>
        </AuthProvider>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
