import { Button, CircularProgress } from "@mui/material";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../authProvider/AuthProvider";
// import { useDispatch } from "react-redux";
// import { fetchFullName } from "../redux/actions"; // <-- uncomment if needed

function SignIn() {
    const [forgetPassword, setForgetPassword] = useState(false);
    const [emailEmptyTrue, setEmailEmptyTrue] = useState(false);
    const [passwordEmptyTrue, setPasswordEmptyTrue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAutoLogin, setIsAutoLogin] = useState(false);

    const email = useRef("");
    const password = useRef("");
    const navigate = useNavigate();
    const { login } = useAuth();
    // const dispatch = useDispatch();

    const signInFromHandler = async (e) => {
        setIsAutoLogin(true);
        e.preventDefault();

        const userObject = {
            email: 'Rohit.sangod74@gmail.com',
            //  email.current.value,
            password: 'Rohit.sangod74@gmail.com'
            //  password.current.value,
        };


        setIsLoading(true);

        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api/auth/signin`;

            const fetchData = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userObject),
            });
            const response = await fetchData.json()
            console.log("Login response:", response.massage)
            if (fetchData.ok) {
                localStorage.setItem("user-ID", response.userData._id);
                localStorage.setItem("access_user", response.data);
                login(response.data, response.userData);
                toast.success(response.massage || "Login successful!");
                const role = String(response?.userData?.role || '').trim().toLowerCase();
                console.log("role", role)
                if (role === 'admin') {
                    navigate("/dashboard/home");
                }
                else if (role === 'consultant') {
                    navigate("/consultant-dashboard");
                }
                else {
                    navigate("/home");
                }

            } else {
                toast.error(response.massage || "Login failed!");
            }


        } catch (err) {
            console.error("sign in failed ...! ", err);
            toast.error("Server not reachable!");
        } finally {
            setIsLoading(false);
        }
    };

    // Auto login function with default credentials
    const autoLogin = async () => {
        const defaultCredentials = {
            email: 'Rohit.sangod74@gmail.com',
            password: 'Rohit.sangod74@gmail.com'
        };

        setIsLoading(true);

        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api/auth/signin`;

            const fetchData = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(defaultCredentials),
            });
            
            const response = await fetchData.json();
            console.log("Auto Login response:", response.massage);
            
            if (fetchData.ok) {
                localStorage.setItem("user-ID", response.userData._id);
                localStorage.setItem("access_user", response.data);
                login(response.data, response.userData);
                toast.success(response.massage || "Auto login successful!");
                
                const role = String(response?.userData?.role || '').trim().toLowerCase();
                console.log("Auto login role:", role);
                
                if (role === 'admin') {
                    navigate("/dashboard/home");
                    setIsAutoLogin(false);
                } else if (role === 'consultant') {
                    navigate("/consultant-dashboard");
                } else {
                    navigate("/home");
                }
            } else {
                toast.error(response.massage || "Auto login failed!");
            }
        } catch (err) {
            console.error("Auto login failed:", err);
            toast.error("Server not reachable for auto login!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Auto login when page loads
        autoLogin();
    }, []);

    return (
        <Fragment>
            <ToastContainer />
            {isAutoLogin && (
                <div className="flex items-center justify-center gap-2 mb-4">
                    <CircularProgress size={20} sx={{ color: "#00FFFF" }} />
                    <span className="text-cyan-300 text-sm">Auto login in progress...</span>
                </div>
            )}
            <div className="main-container h-screen w-full flex">
                {/* Left Side Image */}
                <div className="img-main h-full w-[40%]">
                    <img
                        className="h-full w-full object-cover"
                        src="https://cdn-cm.freepik.com/previews/51db95ba-51fd-4f85-821e-0d90d5d7dbc8.jpg?w=500&h=500"
                        alt="Login Banner"
                    />
                </div>

                {/* Right Side Form */}
                <div className="form-main h-full w-[60%] flex justify-center items-center">
                    <form
                        className="sign-in-form flex flex-col gap-3 w-full px-40"
                        onSubmit={signInFromHandler}
                        style={{ opacity: isLoading ? 0.6 : 1 }}
                    >
                        <h1 className="font-bold text-3xl mb-3">
                            {isLoading ? "Auto Logging In..." : "Access Your Account"}{" "}
                            <span className="text-cyan-300">{isLoading ? "Please Wait" : "Now"}</span>
                        </h1>
                        
                        {isLoading && (
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <CircularProgress size={20} sx={{ color: "#00FFFF" }} />
                                <span className="text-cyan-300 text-sm">Auto login in progress...</span>
                            </div>
                        )}

                        {/* Email */}
                        <label
                            className={`flex flex-col shadow-sm shadow-black/10 pt-1 ${emailEmptyTrue ? "bg-red-400/20" : ""
                                }`}
                        >
                            <span
                                className={`font-semibold pl-1 ${emailEmptyTrue ? "text-red-400" : ""
                                    }`}
                            >
                                Email
                            </span>
                            <input
                                ref={email}
                                className={`p-2 border-b outline-0 ${emailEmptyTrue ? "border-red-400" : "border-black/50"
                                    }`}
                                type="text"
                                placeholder="Enter email"
                                required
                                disabled={isLoading}
                            />
                        </label>

                        {/* Password */}
                        <label
                            className={`flex flex-col shadow-sm shadow-black/10 pt-1 ${passwordEmptyTrue ? "bg-red-400/20" : ""
                                }`}
                        >
                            <span
                                className={`font-semibold pl-1 ${passwordEmptyTrue ? "text-red-400" : ""
                                    }`}
                            >
                                Password
                            </span>
                            <input
                                ref={password}
                                className={`p-2 border-b outline-0 ${passwordEmptyTrue ? "border-red-400" : "border-black/50"
                                    }`}
                                type="password"
                                placeholder="Enter Password"
                                required
                                disabled={isLoading}
                            />
                        </label>

                        {/* Forget Password */}
                        <div className="flex gap-2 font-semibold justify-end text-sm">
                            <p
                                onClick={() => setForgetPassword(!forgetPassword)}
                                className="underline text-blue-600 cursor-pointer"
                            >
                                Forget Password
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="outlined"
                            sx={{
                                fontSize: 14,
                                p: 1,
                                color: "white",
                                bgcolor: isLoading ? "#686262" : "black",
                                border: "none",
                                "&:hover": { bgcolor: "gray.800" },
                            }}
                            disabled={isLoading} // disable while loading
                        >
                            {isLoading ? (
                                <CircularProgress size={20} sx={{ color: "white" }} />
                            ) : (
                                "Sign in"
                            )}
                        </Button>

                        {/* Sign Up Link */}
                        <div className="flex gap-2 font-semibold justify-end">
                            <p className="underline">Don’t have an account?</p>
                            <Link to="/signup" className="font-bold text-blue-600">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default SignIn;
