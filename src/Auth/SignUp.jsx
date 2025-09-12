import { Box, Button, TextField } from '@mui/material'

import React, { Fragment, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

function SignUp() {

    const [fullNameReq, setFullNameReq] = useState(false)
    const [emailReq, setEmailReq] = useState(false)
    const [passwordReq, setPassword] = useState(false)
    const [massageReq, setMassageReq] = useState("")
    const [usernameReq, setUsernameReq] = useState(false)



    const fullname = useRef("")
    // const username = useRef("")
    const email = useRef("")
    const password = useRef("")
    const navigate = useNavigate()

    const signUpFromHandler = async (e) => {

        e.preventDefault()

        const object = {
            fullname: fullname.current.value,
            // username: username.current.value,
            email: email.current.value,
            password: password.current.value
        }

        if ((fullname.current.value).length === 0) {
            setFullNameReq(true)
            return false
        }

        // if ((username.current.value).length === 0) {
        //     setUsernameReq(true)
        //     return false
        // }

        if ((email.current.value).length === 0) {
            setEmailReq(true)
            return false
        }

        if ((password.current.value).length === 0) {
            setPassword(true)
            return false
        }

        try {
            const url = `https://sainiweb-agora-backend.onrender.com/api/auth/signup`
            const fetchData = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(object)
            })
            const response = await fetchData.json()
            toast(JSON.stringify(response.massage));
            setMassageReq(response.massageReq)

            if (fetchData.ok) {
                navigate("/")
            }

            console.log(response)
        } catch (err) {
            console.log(err)
        }

        // setSignUpForm(object)
    }

    // console.log("signUpFrom", signUpFrom)


    return (
        <Fragment>
            <ToastContainer />
            <div className='mian-container  h-screen w-full flex'>
                <div className='h-full w-[40%]'>
                    <img className='h-full w-full object-cover' src='https://cdn-cm.freepik.com/previews/51db95ba-51fd-4f85-821e-0d90d5d7dbc8.jpg?token=exp=1746429685~hmac=23365538c0a05ae543230de2cb33c837eaff81ba7802bcedf774c82d141e831d?w=500&h=500' />
                </div>
                <div className='h-full w-[60%] flex justify-center items-center'>
                    <form className=' flex flex-col gap-5  w-full px-40'>
                        <h1 className='heading-signup font-bold text-3xl mb-3'>Let's Get Your Account <span className='text-cyan-400 '>Set up</span> </h1>

                        <label className={`flex flex-col shadow-sm shadow-black/10 pt-1 ${fullNameReq ? "bg-red-300/20" : ""}`}>
                            <label htmlFor="" className={`font-semibold text-md px-2  ${fullNameReq ? "text-red-400" : ""}`}>Full Name</label>
                            <input ref={fullname} className={`p-2 border-b-3 border-black/50    outline-0 ${fullNameReq ? "border-red-400" : "border-black/50"} `} type='text' placeholder='Enter  name'></input>
                        </label>

                        {/* <label className={`flex flex-col shadow-sm shadow-black/10 pt-1 ${usernameReq ? "bg-red-300/20" : ""}`}>
                            <label htmlFor="" className={`font-semibold text-md px-2  ${usernameReq ? "text-red-400" : ""}`}>Username</label>
                            <input ref={username} className={`p-2 border-b-3 border-black/50    outline-0 ${usernameReq ? "border-red-400" : "border-black/50"} `} type='text' placeholder='Enter username'></input>
                        </label> */}

                        <label className={`flex flex-col shadow-sm shadow-black/10 pt-1 ${emailReq ? "bg-red-300/20" : ""}`}>
                            <label htmlFor="" className={`font-semibold px-2 ${emailReq ? "text-red-400" : ""}`}>Email</label>
                            <input ref={email} className={`p-2 border-b-3  outline-0 ${emailReq ? "border-red-400" : "border-black/50"}`} type='email' placeholder='Enter email'></input>
                        </label>
                        <div>
                            <label className={`flex flex-col shadow-sm shadow-black/10 pt-1 ${passwordReq ? "bg-red-300/20" : ""}`}>
                                <label htmlFor="" className={`font-semibold px-2 ${passwordReq ? "text-red-400" : ""}`}>Password</label>
                                <input ref={password} type="password" className={`p-2 border-b-3 border-black/50 outline-0 ${passwordReq ? "border-red-400" : "border-black/50"}`} placeholder='Create password'></input>

                            </label>
                            <span className='text-[12px] duration-700 text-red-400 font-semibold'>{massageReq}</span>
                        </div>
                        <Button onClick={signUpFromHandler} variant="outlined" sx={{ fontSize: 14, p: 1, color: 'white', bgcolor: 'black', border: 'none' }}>Sign up</Button>

                        <div className=' flex gap-2 font-semibold justify-end'>
                            <p className=' underline'>If you have an account ?</p>
                            <Link to={"/"} className='font-bold text-blue-600'>Sign in</Link>
                        </div>

                    </form>
                </div>

            </div>
        </Fragment>
    )
}

export default SignUp