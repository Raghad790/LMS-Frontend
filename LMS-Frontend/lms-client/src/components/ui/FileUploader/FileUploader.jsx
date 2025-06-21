// src/components/common/FileUploader.jsx
import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../../services/api";
import styles from "./FileUploader.module.css";

const FileUploader = ({
  onUploadComplete,
  acceptTypes = "image/*",
  maxSizeMB = 5,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (!selectedFile) {
      setFile(null);
      setPreview("");
      return;
    }

    // Check file size
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      // Get token from both possible storage locations
      const token =
        localStorage.getItem("lms_auth_token") || localStorage.getItem("token");

      console.log(
        "Uploading file with token:",
        token ? "Token exists" : "No token found"
      );
      // Use the correct endpoint for uploads - make sure it matches your backend
      const response = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      console.log("Upload response:", response.data);
      setUploadedFile(response.data.data || response.data);

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(response.data.data || response.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview("");
    setUploadedFile(null);
    setError("");
  };

  return (
    <div className={styles.fileUploader}>
      {!file && !uploadedFile ? (
        <div className={styles.dropzone}>
          <input
            type="file"
            id="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file" className={styles.fileLabel}>
            <Upload size={32} />
            <p>Click or drag file to upload</p>
            <span>Max size: {maxSizeMB}MB</span>
          </label>
        </div>
      ) : (
        <div className={styles.preview}>
          {preview && (
            <img
              src={preview}
              alt="File preview"
              className={styles.previewImage}
            />
          )}

          <div className={styles.fileInfo}>
            <p>{file?.name || uploadedFile?.original_name}</p>
            <span>
              {((file?.size || uploadedFile?.size) / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          {!uploadedFile && (
            <div className={styles.actions}>
              <button
                onClick={handleUpload}
                className={styles.uploadButton}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className={styles.spinner}></div>
                    <span>{progress}%</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRemove}
                className={styles.removeButton}
                disabled={uploading}
              >
                <X size={16} />
                <span>Remove</span>
              </button>
            </div>
          )}

          {uploadedFile && (
            <div className={styles.uploadSuccess}>
              <CheckCircle size={16} className={styles.successIcon} />
              <span>Uploaded successfully</span>
              <button onClick={handleRemove} className={styles.removeButton}>
                <X size={16} />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
