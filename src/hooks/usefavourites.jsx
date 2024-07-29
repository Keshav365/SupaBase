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
        if (!currentUser) return;

        const q = query(
            collection(db, 'trash'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const childFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles },
            });
        });

        return unsubscribe;
    }, [currentUser]);

    return state;
}

export function useFavourites() {
    const [state, dispatch] = useReducer(reducer, {
        childFiles: [],
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'favourites'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const childFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles },
            });
        });

        return unsubscribe;
    }, [currentUser]);

    return state;
}
