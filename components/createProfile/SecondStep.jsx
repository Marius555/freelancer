"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from "@heroui/react";
import { Camera, Upload, X, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';


const SecondStep = ({ onNext, onBack, formData, setFormData }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Restore image data from formData when component mounts
  useEffect(() => {
    if (formData?.profilePicturePreview) {
      setImagePreview(formData.profilePicturePreview);
    }
    if (formData?.profilePicture) {
      setSelectedFile(formData.profilePicture);
    }
  }, [formData]);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Store the original file object
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = async () => {
    if (!imagePreview || !selectedFile) {
      setError('Please upload a profile picture');
      return;
    }

    setIsUploading(true);
    try {
      // Store both the file object and the preview
      setFormData({ 
        ...formData, 
        profilePicture: selectedFile, // Store the actual File object
        profilePicturePreview: imagePreview // Store the base64 preview for display
      });
      onNext();
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold mb-2 text-foreground text-primary">
          Profile Picture
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a photo to personalize your profile
        </p>
      </div>

      <div className="space-y-6">
        {!imagePreview ? (
          <motion.div
            {...getRootProps()}
            className={`rounded-xl p-10 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'bg-primary/5 scale-[1.02]' 
                : 'bg-card hover:bg-card/80'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/5 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground flex items-center justify-center gap-2">
                  {isDragActive ? (
                    <>
                      <Upload className="w-5 h-5" />
                      Drop your image here
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload photo
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-xs mx-auto"
          >
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={imagePreview}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 p-2 bg-background/80 backdrop-blur-sm text-foreground rounded-full hover:bg-background transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive text-center"
          >
            {error}
          </motion.p>
        )}

        <div className="flex justify-between gap-4 pt-4">
          <Button
            onPress={onBack}
            className="flex-1 p-2 flex flex-row items-center justify-center gap-2 bg-default text-secondary-foreground rounded-lg hover: transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-small text-small">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onPress={handleSubmit}
            disabled={!imagePreview || isUploading}
            className={`flex-1 px-8 py-2.5 bg-primary text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 ${
              (!imagePreview || isUploading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SecondStep;
