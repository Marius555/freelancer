"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox, Card } from "@heroui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, Youtube, Instagram, Camera, Edit3, Clock, Zap } from "lucide-react";
import { zeroStepResolver } from "../../resolvers/createProfileResolvers";

const ZeroStep = ({ onNext, formData, setFormData }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [customPlatform, setCustomPlatform] = useState("");
  const [isCustomPlatform, setIsCustomPlatform] = useState(false);
  const [contentTypes, setContentTypes] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zeroStepResolver,
    defaultValues: formData || {
      platforms: [],
      customPlatform: "",
      contentTypes: [],
    },
  });

  // Restore form data when component mounts
  useEffect(() => {
    if (formData) {
      if (formData.platforms) {
        setSelectedPlatforms(formData.platforms);
        setValue("platforms", formData.platforms);
      }
      if (formData.customPlatform) {
        setCustomPlatform(formData.customPlatform);
        setValue("customPlatform", formData.customPlatform);
        setIsCustomPlatform(true);
      }
      if (formData.contentTypes) {
        setContentTypes(formData.contentTypes);
        setValue("contentTypes", formData.contentTypes);
      }
    }
  }, [formData, setValue]);

  const platforms = [
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-gray-600",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Camera,
      color: "text-gray-600",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-gray-600",
    },
    {
      id: "no_platform",
      name: "No Specific Platform",
      icon: Edit3,
      color: "text-gray-600",
    },
  ];

  const contentTypeOptions = [
    {
      id: "short_form",
      name: "Short-form Content",
      description: "Quick, engaging content (under 5 minutes)",
      icon: Zap,
      color: "text-blue-600",
    },
    {
      id: "long_form",
      name: "Long-form Content",
      description: "In-depth content, tutorials, documentaries",
      icon: Clock,
      color: "text-green-600",
    },
  ];

  const handlePlatformSelect = (platformId) => {
    let updatedPlatforms;
    
    if (selectedPlatforms.includes(platformId)) {
      updatedPlatforms = selectedPlatforms.filter(p => p !== platformId);
    } else {
      updatedPlatforms = [...selectedPlatforms, platformId];
    }
    
    setSelectedPlatforms(updatedPlatforms);
    setValue("platforms", updatedPlatforms);
  };

  const handleContentTypeSelect = (contentType) => {
    let updatedContentTypes;
    
    if (contentTypes.includes(contentType)) {
      updatedContentTypes = contentTypes.filter(c => c !== contentType);
    } else {
      updatedContentTypes = [...contentTypes, contentType];
    }
    
    setContentTypes(updatedContentTypes);
    setValue("contentTypes", updatedContentTypes);
  };

  const handleCustomPlatformChange = (value) => {
    setCustomPlatform(value);
    setValue("customPlatform", value);
  };

  const onSubmit = (data) => {
    const stepData = {
      platforms: selectedPlatforms,
      customPlatform: isCustomPlatform ? customPlatform : "",
      contentTypes: contentTypes,
    };
    
    setFormData({ ...formData, ...stepData });
    onNext();
  };

  const isFormValid = (selectedPlatforms.length > 0 || (isCustomPlatform && customPlatform.trim())) && contentTypes.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-card rounded-xl"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-6 text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Content Creation Focus
        </h1>
     
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        {/* Platform Selection */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              Which platforms do you create content for?
            </h2>
           
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);
              
              return (
                <Card
                  key={platform.id}
                  isPressable
                  onPress={() => handlePlatformSelect(platform.id)}
                  className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                    isSelected 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-content1 border-content2 hover:border-content3'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? platform.color : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-default-700'}`}>
                      {platform.name}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Custom Platform Option */}
          <div className="space-y-3">
            <Checkbox
              isSelected={isCustomPlatform}
              onValueChange={setIsCustomPlatform}
              size="sm"
            >
              <span className="text-sm">Other platform or custom focus</span>
            </Checkbox>
            
            {isCustomPlatform && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  variant="bordered"
                  label="Specify your platform or focus"
                  placeholder="e.g., Personal blog, LinkedIn, Podcast, etc."
                  value={customPlatform}
                  onValueChange={handleCustomPlatformChange}
                  className="w-full"
                  size="sm"
                />
              </motion.div>
            )}
          </div>
          
          {errors.platforms && (
            <p className="text-danger text-xs">{errors.platforms.message}</p>
          )}
        </motion.div>

        {/* Content Type Selection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              What type of content do you create?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {contentTypeOptions.map((contentType) => {
              const IconComponent = contentType.icon;
              const isSelected = contentTypes.includes(contentType.id);
              
              return (
                <Card
                  key={contentType.id}
                  isPressable
                  onPress={() => handleContentTypeSelect(contentType.id)}
                  className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                    isSelected 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-content1 border-content2 hover:border-content3'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${isSelected ? contentType.color : 'text-default-500'}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-default-700'}`}>
                        {contentType.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        {contentType.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {errors.contentTypes && (
            <p className="text-danger text-xs">{errors.contentTypes.message}</p>
          )}
        </motion.div>

        {/* Simple Hint */}
        <p className="text-xs text-gray-600">
          <strong>Hint:</strong> Photo editing, retouching, and post-production work are considered part of long-form content creation.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end pt-2"
        >
          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex px-6 sm:px-8 py-2.5 flex-row items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium text-base sm:text-lg ${
              !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            <p className="text-sm sm:text-base font-medium">Next</p>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ZeroStep;
