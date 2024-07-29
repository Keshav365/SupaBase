import React, { useRef, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, serverTimestamp, database } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import '../CSS/card.css';

export default function UserName() {
    const { currentUser } = useAuth();
    const UserNameRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUsernameExists = async () => {
            if (currentUser) {
                const q = query(collection(db, "UserNames"), where("userId", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setUsernameExists(true);
                    navigate("/"); // Navigate to dashboard or desired page if username exists
                }
            }
        };
        checkUsernameExists();
    }, [currentUser, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!usernameExists) {
            try {
                setError("");
                setLoading(true);
                await database.addUsername({
                    username: UserNameRef.current.value,
                    userId: currentUser.uid,
                    createdAt: serverTimestamp(),
                    email: currentUser.email,
                });
                navigate("/"); // Navigate to dashboard or desired page after username is set
            } catch (error) {
                console.error("FirebaseError:", error);
                setError("Failed to set username. Please try again.");
            }
            setLoading(false);
        }
    }

    return (
        <>
            {error && (
                <div className="sideAlert error">
                    <span className="closebtn" onClick={() => setError("")}>&times;</span>
                    <p>{error}</p>
                </div>
            )}
            {!usernameExists && (
                <div className="loginDiv">
                    <div className='signUp'>
                        <h1 className="logo-badge text-whitesmoke">
                            {/* Logo */}
                        </h1>
                        <h3 className="text-whitesmoke">Set Username</h3>
                    </div>
                    <div className="container-content">
                        <Form className="margin-t" onSubmit={handleSubmit}>
                            <div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Username" ref={UserNameRef} required />
                                </div>
                            </div>
                            <div>
                                <Button disabled={loading} type="submit" className="form-button button-l margin-b">
                                    Proceed
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
}
