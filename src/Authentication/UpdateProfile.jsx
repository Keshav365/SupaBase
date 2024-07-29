import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import '../CSS/card.css'

export default function UpdateProfile() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  // const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/user")
      })
      .catch(() => {
        setError("Password changed successfully")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div className="loginDiv">
        <div className='signUp'>
          <h1 className="logo-badge text-whitesmoke">
            {/* Logo */}
          </h1>
          <h3 className="text-whitesmoke">Update Profile</h3>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="container-content">
          <Form className="margin-t" onSubmit={handleSubmit}>
            <div>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Email" ref={emailRef} required defaultValue={currentUser.email} />
              </div>
            </div>
            <div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Password" ref={passwordRef} required />
              </div>
            </div>
            <div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Confirm Password" ref={passwordConfirmRef} required />
              </div>
            </div>
            <div>
              <Button disabled={loading} type="submit" className="form-button button-l margin-b">
                Update
              </Button>
            </div>
            <div className="w-100 text-center mt-2">
              <Link to="/user">Cancel</Link>
            </div>
          </Form>
          <p className="margin-t text-whitesmoke"><small>SupaDrive &copy; 2024,</small></p>
        </div>
      </div>
    </>
  )
}
