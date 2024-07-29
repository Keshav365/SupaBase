import React, { useState, useEffect } from 'react';
import '../CSS/uploadFile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@material-ui/core';
import { auth, database, storage, ref, uploadBytesResumable, getDownloadURL, serverTimestamp } from '../../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import UploadingPara from './uploading.jsx';
import UploadProgress from './UploadProgress.jsx';
import { ROOT_FOLDER } from '../../hooks/useFolder.js';

const MAX_STORAGE_LIMIT_GB = 15;
const MAX_STORAGE_LIMIT_BYTES = MAX_STORAGE_LIMIT_GB * 1024 * 1024 * 1024; // Convert GB to bytes

function FileUploadForm({ currentFolder, updateStorageUsed }) {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [user, setUser] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const calculateStorageUsed = async (userId) => {
        const userFiles = await database.getUserFiles(userId, 'files');
        const userTrash = await database.getUserFiles(userId, 'trash');

        const totalStorageUsed = [...userFiles, ...userTrash].reduce((total, file) => {
            return total + (file.size || 0);
        }, 0);

        return totalStorageUsed;
    };

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        setUploading(true);
        setError('');

        if (!user) {
            setError("You need to be signed in to upload files");
            setUploading(false);
            return;
        }
        if (files.length === 0) {
            setError("Please select files to upload");
            setUploading(false);
            return;
        }

        try {
            // Calculate the current storage used
            let totalStorageUsed = await calculateStorageUsed(user.uid);

            const newUploadProgress = {};
            const uploadTasks = files.map(async (file) => {
                // Check if adding this file exceeds the limit
                if (totalStorageUsed + file.size > MAX_STORAGE_LIMIT_BYTES) {
                    throw new Error('You have exceeded your storage limit.');
                }

                const folderPath = currentFolder.path.map(folder => folder.name || folder.id).join('/');
                const filePath = currentFolder === ROOT_FOLDER
                    ? `${folderPath}/${file.name}`
                    : `${folderPath}/${currentFolder.name}/${file.name}`;
                const fileRef = ref(storage, filePath);

                const uploadTask = uploadBytesResumable(fileRef, file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        newUploadProgress[file.name] = progress;
                        setUploadProgress({ ...newUploadProgress });
                    },
                    (error) => {
                        console.error(error);
                        setError('Error uploading files.');
                        setUploading(false);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            await database.addFile({
                                name: file.name,
                                url: downloadURL,
                                userId: user.uid,
                                createdAt: serverTimestamp(),
                                size: uploadTask.snapshot.bytesTransferred,
                                folderId: currentFolder.id,
                                fileState: 'nonFav',
                            });
                            totalStorageUsed += file.size;
                            updateStorageUsed(totalStorageUsed); // Update the storage used state

                            // Remove the completed file from the upload progress
                            const updatedProgress = { ...newUploadProgress };
                            delete updatedProgress[file.name];
                            setUploadProgress(updatedProgress);
                        } catch (e) {
                            console.error("Error adding document: ", e);
                            setError('Error saving file information.');
                        }
                    }
                );
            });

            await Promise.all(uploadTasks);

            setFiles([]);
            setUploading(false);
            closeModal();
        } catch (error) {
            console.error('Error checking storage limit: ', error);
            setError('Error checking storage limit.');
            setUploading(false);
        }
    };

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="uploadButton">
                <button onClick={openModal}>
                    <FontAwesomeIcon icon={faFileUpload} />
                </button>
            </div>
            <Modal open={open} onClose={closeModal}>
                {uploading ? (
                    <UploadingPara progress={uploadProgress} />
                ) : (
                    <div className="UploadDiv">
                        <div className="container-content">
                            <form className="margin-t" onSubmit={handleUpload}>
                                <div className="form-group">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="fileInput"
                                        multiple
                                        required
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="form-button button-l margin-b">Upload</button>
                                    <button type="button" onClick={closeModal} className="form-button button-l margin-b">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Modal>
            <UploadProgress progress={uploadProgress} />
        </>
    );
}

export default FileUploadForm;
