import React, { useState } from 'react'
import { Fragment } from 'react'
import StaffRegistrationForm from '../DashbordPages/StaffRegistrationForm'
import StaffList from '../DashbordPages/StaffList'
import { Box } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'

function StaffRoot() {
    const [isTrue, setIsTrue] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [employeeData, setEmployeeData] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        dateOfBirth: '',
        gender: '',
        role: '',
        isActive: false,
    })
    const [role, setRole] = useState('')
    console.log(role)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    }
    const isHandler = async () => {
        setIsTrue(!isTrue)
    }
    const createEmployee = async () => {
        const payload = {
            ...employeeData,
            role: role,
        }

        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-employee/add-employee`
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        toast.success("Employee created successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })

    }
    console.log(employeeData)
    return (
        <Fragment>
            <ToastContainer />
            <Box >
                {
                    isTrue
                        ?
                        <StaffRegistrationForm
                            isHandler={isHandler}
                            createEmployee={createEmployee}
                            handleChange={handleChange}
                            employeeData={employeeData}
                            role={role}
                            setRole={setRole}
                        />
                        :
                        <StaffList
                            isHandler={isHandler}
                        />
                }
            </Box>
        </Fragment>
    );
}

export default StaffRoot;