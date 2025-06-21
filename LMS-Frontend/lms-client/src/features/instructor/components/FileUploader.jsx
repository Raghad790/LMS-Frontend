// src/features/instructor/components/FileUploader.jsx
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import styles from "./FileUploader.module.css";
import {
  Upload,
  File,
  FileText,
  Trash2,
  CheckCircle,
  Image,
  Film,
  Music,
  Archive,
  Code,
  AlertCircle,
  X,
  Download,
} from "lucide-react";

const FileUploader = ({
  lessonId,
  existingFiles = [],
  onFileAdded,
  onFileDeleted,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState(existingFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    // Check file size (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 20MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lesson_id", lessonId);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await api.post(`/lesson-files`, formData, {
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
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);

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
      await api.delete(`/lesson-files/${fileId}`);
      const updatedFiles = files.filter((file) => file.id !== fileId);
      setFiles(updatedFiles);

      if (onFileDeleted) {
        onFileDeleted(fileId);
      }

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <Image size={20} />;
    if (fileType === "application/pdf") return <FileText size={20} />;
    if (fileType.startsWith("video/")) return <Film size={20} />;
    if (fileType.startsWith("audio/")) return <Music size={20} />;
    if (fileType.startsWith("text/")) return <Code size={20} />;
    if (fileType.includes("zip") || fileType.includes("compressed"))
      return <Archive size={20} />;
    return <File size={20} />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.fileUploader}>
      <div
        className={`${styles.uploadArea} ${
          isDragging ? styles.dragActive : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className={styles.fileInput}
          ref={fileInputRef}
        />

        <div className={styles.uploadContent}>
          <div className={styles.uploadIconContainer}>
            <Upload className={styles.uploadIcon} />
          </div>
          <div className={styles.uploadText}>
            <h4>
              {isDragging ? "Drop the file here" : "Upload Course Materials"}
            </h4>
            <p>
              Drag & drop files or{" "}
              <span className={styles.browseText}>browse</span>
            </p>
            <span className={styles.fileLimit}>Max file size: 20MB</span>
          </div>
        </div>

        {isUploading && (
          <div className={styles.progressWrapper}>
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${uploadProgress}%` }}
              >
                <span className={styles.progressText}>{uploadProgress}%</span>
              </div>
            </div>
            <div className={styles.uploadingText}>
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.fileListHeader}>
            <h4>Attached Files</h4>
            <span className={styles.fileCount}>
              {files.length} {files.length === 1 ? "file" : "files"}
            </span>
          </div>

          <div className={styles.fileItems}>
            {files.map((file) => (
              <div key={file.id} className={styles.fileItem}>
                <div className={styles.fileItemLeft}>
                  <div className={styles.fileIconContainer}>
                    {getFileIcon(file.mime_type)}
                  </div>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.filename}</span>
                    <span className={styles.fileSize}>
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>

                <div className={styles.fileActions}>
                  <a
                    href={file.url}
                    download
                    className={styles.downloadButton}
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
