// LMS-Frontend/lms-client/src/features/instructor/components/FileUploader.jsx

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUpload, FiFile, FiTrash2, FiCheckCircle } from "react-icons/fi";
import styles from "./FileUploader.module.css";

const FileUploader = ({ lessonId, existingFiles = [], onFileAdded }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState(existingFiles);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lesson_id", lessonId);
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const response = await axios.post("/api/lesson-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      const newFile = response.data.data;
      setFiles([...files, newFile]);
      
      if (onFileAdded) {
        onFileAdded(newFile);
      }
      
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }
    
    try {
      await axios.delete(`/api/lesson-files/${fileId}`);
      setFiles(files.filter(file => file.id !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType === "application/pdf") return "📄";
    if (fileType.startsWith("video/")) return "🎬";
    if (fileType.startsWith("audio/")) return "🎵";
    return "📎";
  };

  return (
    <div className={styles.fileUploader}>
      <div className={styles.uploadArea}>
        <label className={styles.uploadButton}>
          <FiUpload className={styles.uploadIcon} />
          <span>Upload Materials</span>
          <input 
            type="file" 
            onChange={handleFileChange} 
            disabled={isUploading}
            className={styles.fileInput}
          />
        </label>
        
        {isUploading && (
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span className={styles.progressText}>{uploadProgress}%</span>
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <div className={styles.fileList}>
          <h4>Attached Files</h4>
          {files.map(file => (
            <div key={file.id} className={styles.fileItem}>
              <span className={styles.fileIcon}>
                {getFileIcon(file.mime_type)}
              </span>
              <span className={styles.fileName}>{file.filename}</span>
              <span className={styles.fileSize}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <button 
                className={styles.deleteButton}
                onClick={() => handleDelete(file.id)}
                title="Delete file"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;