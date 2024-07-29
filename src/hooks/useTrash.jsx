import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { query, where, orderBy, onSnapshot, collection } from "firebase/firestore";
import { useReducer, useEffect } from "react";

const ACTIONS = {
    SET_CHILD_FILES: "set-child-files",
};

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles,
            };
        default:
            return state;
    }
}

export function useTrash() {
    const [state, dispatch] = useReducer(reducer, {
        childFiles: [],
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            console.log('No current user');
            return;
        }

        console.log('Current user:', currentUser.uid);

        const q = query(
            collection(db, 'trash'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt')
        );

        console.log('Firestore Query:', q);

        const unsubscribe = onSnapshot(q, snapshot => {
            console.log('Snapshot received:', snapshot);
            console.log('Snapshot metadata:', snapshot.metadata);
            console.log('Snapshot docs:', snapshot.docs);

            const childFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('Trash Files:', childFiles);

            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles },
            });
        }, (error) => {
            console.error('Snapshot error:', error);
        });

        return unsubscribe;
    }, [currentUser]);

    return state;
}
