import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";


const FindUsername = ({ currentUser }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const usernameRef = useRef(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userRef = firebase.firestore().collection('users').doc(currentUser.id);
        const doc = await userRef.get();

        if (doc.exists) {
          setUsername(doc.data().username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        // Display a user-friendly error message to the user
        alert('Failed to fetch username. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsername();
    }
  }, [currentUser]);

  const handleSaveUsername = async () => {
    const newUsername = usernameRef.current.value.trim();

    if (newUsername === '') {
      alert('Please enter a username.');
      return;
    }

    try {
      const querySnapshot = await firebase.firestore().collection('users')
        .where('username', '==', newUsername)
        .get();

      if (!querySnapshot.empty) {
        alert('Username already exists. Please choose a different one.');
        return;
      }

      await firebase.firestore().collection('users').doc(currentUser.id)
        .set({ username: newUsername }, { merge: true });

      setUsername(newUsername);
      alert('Username saved successfully!');
    } catch (error) {
      console.error('Error saving username:', error);
      alert('Failed to save username. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {username ? (
        <p>Your username is: {username}</p>
      ) : (
        <div>
          <input type="text" ref={usernameRef} placeholder="Enter username" />
          <button onClick={handleSaveUsername}>Save Username</button>
        </div>
      )}
    </div>
  );
};

export default FindUsername;
