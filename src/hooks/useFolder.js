import { useAuth } from "../contexts/AuthContext";
import { database, db } from "../firebase";
import { query, where, orderBy, onSnapshot, collection, doc, getDoc } from "firebase/firestore";
import { useReducer, useEffect } from "react";

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS: "set-child-folders",
    SET_CHILD_FILES: "set-child-files",
};

export const ROOT_FOLDER = { name: "Root", id: null, path: [] };

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: [],
            };
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder,
            };
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders,
            };
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles,
            };
        default:
            return state;
    }
}

export function useFolder(folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
    }, [folderId, folder]);

    useEffect(() => {
        if (folderId == null) {
            console.log("No folderId provided, setting to ROOT_FOLDER");
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER },
            });
        }

        const folderRef = doc(db, 'folders', folderId);
        getDoc(folderRef)
            .then(docSnap => {
                if (docSnap.exists()) {
                    dispatch({
                        type: ACTIONS.UPDATE_FOLDER,
                        payload: { folder: { id: docSnap.id, ...docSnap.data() } },
                    });
                } else {
                    console.log("Folder does not exist, setting to ROOT_FOLDER");
                    dispatch({
                        type: ACTIONS.UPDATE_FOLDER,
                        payload: { folder: ROOT_FOLDER },
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching folder:", error);
                dispatch({
                    type: ACTIONS.UPDATE_FOLDER,
                    payload: { folder: ROOT_FOLDER },
                });
            });
    }, [folderId]);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'folders'),
            where('parentId', '==', folderId),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const childFolders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched child folders:", folderId, childFolders);
            
            dispatch({
                type: ACTIONS.SET_CHILD_FOLDERS,
                payload: { childFolders },
            });
        });

        return unsubscribe;
    }, [folderId, currentUser]);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'files'),
            where('folderId', '==', folderId),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const childFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched child files:", folderId, childFiles);
            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles },
            });
        });

        return unsubscribe;
    }, [folderId, currentUser]);

    return state;
}
