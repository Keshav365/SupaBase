import { useState, useRef } from 'react';
import '../CSS/uploadFile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@material-ui/core';
import { collection, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { database } from '../../firebase.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import firebase from 'firebase/compat/app';
import { ROOT_FOLDER } from '../../hooks/useFolder.js';

function FolderUploadForm({ currentFolder }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const { currentUser } = useAuth();
    const modalRef = useRef(null);



    function handleFormUpload(e) {
        e.preventDefault();

        if (currentFolder == null) return
        const path = [...currentFolder.path]
        if (currentFolder !== ROOT_FOLDER) {
            path.push({ name: currentFolder.name, id: currentFolder.id })
        }
        // Create a folder in the database
        database.addFolder({
            name: name,
            parentId: currentFolder.id,
            userId: currentUser.uid,
            path: path,
            createdAt: serverTimestamp(),
        }).then(() => {
            setName("");
            closeModal();
        }).catch(error => {
            console.error("Error adding folder:", error);
        });
    }

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    return (
        <>
            <div className="uploadButton">
                <button onClick={openModal}>
                    <FontAwesomeIcon icon={faFolderPlus} />
                </button>
            </div>
            <Modal
                open={open}
                onClose={closeModal}
                ref={modalRef}
            >
                <div className="UploadDiv">
                    <div className="container-content">
                        <form className="margin-t" onSubmit={handleFormUpload}>
                            <div className="form-group">
                                <FontAwesomeIcon icon={faFileUpload} />
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                            <div>
                                <button type="submit" className="form-button button-l margin-b">Create Folder</button>
                                <button type="button" onClick={closeModal} className="form-button button-l margin-b">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default FolderUploadForm;
