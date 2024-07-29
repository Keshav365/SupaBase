import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function useUserName() {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Query to find the document where the userId field matches currentUser.uid
        const q = query(
          collection(db, 'UserNames'),
          where('userId', '==', currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Get the first matching document
          console.log("UserName document data:", doc.data());
          setUserName(doc.data().username);
        } else {
          console.log("No matching UserName document found");
          setUserName(null);
        }
      } catch (error) {
        console.error("Error fetching username: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [currentUser]);

  return { userName, loading, error };
}
