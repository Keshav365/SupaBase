import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { doc } from "@firebase/firestore/lite"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch (error) {
      console.log(error)
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    const closeBtn = document.querySelector('.closebtn');
    const sideAlert = document.querySelector('.sideAlert');

    closeBtn.addEventListener('click', () => {
      sideAlert.style.display = 'none';
    });
  });

  function hideParent(e) {
    e.target.parentElement.style.display = 'none';
  }
  return (
    <>


      {message && (
        <div className="sideAlert success">
          <span className="closebtn" onClick={() => setMessage("")}>&times;</span>
          <p>{message}</p>
        </div>
      )}
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
          <h3 className="text-whitesmoke">Password Reset</h3>
        </div>
        {/* {error && <Alert variant="danger"><div className="sideAlert">{error}</div></Alert>}
        {message && <Alert variant="success"><div className="sideAlert">{message}</div></Alert>} */}

        <Form onSubmit={handleSubmit}>
          <div>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Email" ref={emailRef} required />
            </div>
          </div>
          <div>
            <Button disabled={loading} type="submit" className="form-button button-l margin-b">
              Reset Password
            </Button>
          </div>
        </Form>
        <p className="text-whitesmoke text-center"><small>Already have an account?, <Link to="/login">Sign In</Link></small></p>
        <p className="text-whitesmoke text-center"><small>Do not have an account?</small></p>
        <a className="text-darkyellow" href="#"><small><Link to="/signup">Sign Up</Link></small></a>
      </div>
    </>
  )
}
