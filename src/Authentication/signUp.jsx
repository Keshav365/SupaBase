import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";  // Note useNavigate instead of useHistory
import '../CSS/card.css';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const  {signup}  = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Note useNavigate instead of useHistory

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate("/UserName");  // Note use navigate instead of history.push
        } catch(error) {
            if(error = 'auth/email-already-in-use'){
                setError("Email already in use, sign-in.")
            }
            else{
            console.log(error)
            setError("Failed to create an account");}
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
                <h1 className="logo-badge text-whitesmoke"></h1>
                <h3 className="text-whitesmoke">Sign Up</h3>
                {error && <Alert variant="danger">{error}</Alert>}
            </div>
            <div className="container-content">
                <form className="margin-t" onSubmit={handleSubmit}>
                    <div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Email" ref={emailRef} required />
                        </div>
                    </div>
                    <div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" ref={passwordRef} required />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Confirm Password" ref={passwordConfirmRef} required />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="form-button button-l margin-b">Sign Up</button>
                    </div>
                    <p className="text-whitesmoke text-center"><small>Already have an account?, <Link to="/login">Sign In</Link></small></p>
                </form>
                <p className="margin-t text-whitesmoke"><small>SupaDrive &copy; 2024,</small></p>
            </div>
        </div>
        </>
    );
}
