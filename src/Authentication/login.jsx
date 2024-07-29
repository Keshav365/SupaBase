import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../CSS/card.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Updated to use useNavigate

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            console.log('Logged in successfully');
            navigate("/UserName"); // Updated to use navigate
        } catch (error) {
            console.error("FirebaseError:", error);
      
            if (error.code === "auth/invalid-credential") {
              setError("Invalid credentials. Please check your email or password and try again.");
            } else {
              setError("Too many login attempts, try again later.");
            }
          }

        setLoading(false);
    }

    return (
        <>
            
            {error && (
                <div className="sideAlert error">
                    <span className="closebtn" onClick={() => setError("")}>&times;</span>
                    <p>{error}</p>
                </div>
            )}
            <div className="loginDiv">
                <div className='signUp'>
                    <h1 className="logo-badge text-whitesmoke">
                        {/* Logo */}
                    </h1>
                    <h3 className="text-whitesmoke">Sign In</h3>
                </div>
                <div className="container-content">
                    <Form className="margin-t" onSubmit={handleSubmit}>
                        <div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Username" ref={emailRef} required />
                            </div>
                        </div>
                        <div>
                            <div className="form-group">
                                <input type="password" className="form-control" placeholder="*****" ref={passwordRef} required />
                            </div>
                        </div>
                        <div>
                            <Button disabled={loading} type="submit" className="form-button button-l margin-b">
                                Sign In
                            </Button>
                        </div>
                        <a className="text-darkyellow" href="#"><small><Link to="/forgot-password">Forgot Password?</Link></small></a>
                        <p className="text-whitesmoke text-center"><small>Do not have an account?</small></p>
                        <a className="text-darkyellow" href="#"><small><Link to="/signup">Sign Up</Link></small></a>
                    </Form>
                    <p className="margin-t text-whitesmoke"><small>SupaDrive &copy; 2024,</small></p>
                </div>
            </div>
        </>
    );
}
