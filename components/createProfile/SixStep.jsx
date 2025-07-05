"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem, DatePicker, Autocomplete, AutocompleteItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { sixStepResolver } from "../../resolvers/createProfileResolvers";
import { submitFirstStep } from "../../appwriteUtils/createProfileAppwrite";
import { submitSecondStep } from "../../appwriteUtils/createProfileAppwrite";
import { submitThirdStep } from "../../appwriteUtils/createProfileAppwrite";
import { submitFourthStep } from "../../appwriteUtils/createProfileAppwrite";
import { submitFifthStep } from "../../appwriteUtils/createProfileAppwrite";
import { submitSixStep } from "../../appwriteUtils/createProfileAppwrite";

const SixStep = ({ onNext, formData, setFormData }) => {
  const [isCustomProfession, setIsCustomProfession] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: sixStepResolver,
    defaultValues: {
      profession: "",
      country: "",
      school: "",
      educationLevel: "",
      startDate: "",
      endDate: "",
    },
  });

  const onlineProfessions = [
    { value: "web_developer", label: "Web Developer" },
    { value: "frontend_developer", label: "Frontend Developer" },
    { value: "backend_developer", label: "Backend Developer" },
    { value: "fullstack_developer", label: "Full Stack Developer" },
    { value: "mobile_developer", label: "Mobile App Developer" },
    { value: "ui_ux_designer", label: "UI/UX Designer" },
    { value: "graphic_designer", label: "Graphic Designer" },
    { value: "digital_artist", label: "Digital Artist" },
    { value: "content_writer", label: "Content Writer" },
    { value: "copywriter", label: "Copywriter" },
    { value: "blog_writer", label: "Blog Writer" },
    { value: "technical_writer", label: "Technical Writer" },
    { value: "video_editor", label: "Video Editor" },
    { value: "video_producer", label: "Video Producer" },
    { value: "motion_graphics", label: "Motion Graphics Designer" },
    { value: "voice_over", label: "Voice Over Artist" },
    { value: "podcast_editor", label: "Podcast Editor" },
    { value: "audio_engineer", label: "Audio Engineer" },
    { value: "music_producer", label: "Music Producer" },
    { value: "social_media_manager", label: "Social Media Manager" },
    { value: "digital_marketer", label: "Digital Marketer" },
    { value: "seo_specialist", label: "SEO Specialist" },
    { value: "ppc_specialist", label: "PPC Specialist" },
    { value: "email_marketer", label: "Email Marketer" },
    { value: "data_analyst", label: "Data Analyst" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "business_analyst", label: "Business Analyst" },
    { value: "project_manager", label: "Project Manager" },
    { value: "virtual_assistant", label: "Virtual Assistant" },
    { value: "customer_service", label: "Customer Service Representative" },
    { value: "translation", label: "Translator" },
    { value: "interpreter", label: "Interpreter" },
    { value: "proofreader", label: "Proofreader" },
    { value: "editor", label: "Editor" },
    { value: "researcher", label: "Researcher" },
    { value: "consultant", label: "Consultant" },
    { value: "coach", label: "Coach" },
    { value: "trainer", label: "Trainer" },
    { value: "instructor", label: "Instructor" },
    { value: "tutor", label: "Tutor" },
    { value: "accountant", label: "Accountant" },
    { value: "bookkeeper", label: "Bookkeeper" },
    { value: "legal_assistant", label: "Legal Assistant" },
    { value: "paralegal", label: "Paralegal" },
    { value: "architect", label: "Architect" },
    { value: "interior_designer", label: "Interior Designer" },
    { value: "photographer", label: "Photographer" },
    { value: "illustrator", label: "Illustrator" },
    { value: "animator", label: "Animator" },
    { value: "3d_artist", label: "3D Artist" },
    { value: "game_developer", label: "Game Developer" },
    { value: "cybersecurity", label: "Cybersecurity Specialist" },
    { value: "network_administrator", label: "Network Administrator" },
    { value: "system_administrator", label: "System Administrator" },
    { value: "devops_engineer", label: "DevOps Engineer" },
    { value: "qa_tester", label: "QA Tester" },
    { value: "other", label: "Other" },
  ];

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "sg", label: "Singapore" },
    { value: "in", label: "India" },
    { value: "br", label: "Brazil" },
    { value: "mx", label: "Mexico" },
    { value: "es", label: "Spain" },
    { value: "it", label: "Italy" },
    { value: "nl", label: "Netherlands" },
    { value: "se", label: "Sweden" },
    { value: "no", label: "Norway" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "ch", label: "Switzerland" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "ie", label: "Ireland" },
    { value: "nz", label: "New Zealand" },
    { value: "za", label: "South Africa" },
    { value: "ar", label: "Argentina" },
    { value: "cl", label: "Chile" },
    { value: "co", label: "Colombia" },
    { value: "pe", label: "Peru" },
    { value: "ve", label: "Venezuela" },
    { value: "uy", label: "Uruguay" },
    { value: "py", label: "Paraguay" },
    { value: "bo", label: "Bolivia" },
    { value: "ec", label: "Ecuador" },
    { value: "gy", label: "Guyana" },
    { value: "sr", label: "Suriname" },
    { value: "gf", label: "French Guiana" },
    { value: "fk", label: "Falkland Islands" },
    { value: "gs", label: "South Georgia" },
    { value: "other", label: "Other" },
  ];

  const educationLevels = [
    { value: "high_school", label: "High School" },
    { value: "associate", label: "Associate Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate/PhD" },
    { value: "certificate", label: "Certificate" },
    { value: "diploma", label: "Diploma" },
    { value: "vocational", label: "Vocational Training" },
    { value: "other", label: "Other" },
  ];

  const handleProfessionChange = (value) => {
    if (value === "other") {
      setIsCustomProfession(true);
      setValue("profession", "", { shouldValidate: false });
    } else {
      setIsCustomProfession(false);
      setValue("profession", value, { shouldValidate: true });
    }
  };

  const handleCountryChange = (value) => {
    setValue("country", value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    // Combine all form data from all steps
    let parentProfileId = null;
    const allFormData = {
      ...formData, // Data from previous steps (FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep)
      education: data // Data from current step (SixStep)
    };

   
    
    if (allFormData.firstName || allFormData.lastName || allFormData.description) {
      const FirstStepData = {
        "firstName": allFormData.firstName,
        "lastName": allFormData.lastName,
        "description": allFormData.description
      }
      const response = await submitFirstStep(FirstStepData);
      if (response.success) {
        parentProfileId = response.parentProfileId;
        console.log(response);
      }
    }
    
    if (allFormData.profilePicture) {
      const secondStepData = {
        "profilePicture": allFormData.profilePicture
      }
      const resp = await submitSecondStep(secondStepData, parentProfileId);
      console.log("step2", resp)
    }
    
    if (allFormData.languages && allFormData.languages.length > 0) {
      // console.log("step3 console", allFormData.languages)
      const thirdStepData = {
        "languages": allFormData.languages
      }
      const resp = await submitThirdStep(thirdStepData, parentProfileId);
    }
    
    if (allFormData.occupation || allFormData.startDate || allFormData.endDate || allFormData.skills) {
      console.log("Step 4 - Occupation & Skills:", {
        occupation: allFormData.occupation,
        startDate: allFormData.startDate,
        endDate: allFormData.endDate,
        isCurrentlyWorking: allFormData.isCurrentlyWorking,
        skills: allFormData.skills
      });
      
      const fourthStepData = {
        occupation: allFormData.occupation,
        startDate: allFormData.startDate,
        endDate: allFormData.endDate,
        isCurrentlyWorking: allFormData.isCurrentlyWorking,
        skills: allFormData.skills,
        yearsOfExperience: allFormData.yearsOfExperience,
        timezone: allFormData.timezone
      };
      const resp = await submitFourthStep(fourthStepData, parentProfileId);
    }
    
    if (allFormData.additionalSkills && allFormData.additionalSkills.length > 0) {
      console.log("Step 5 - Additional Skills:", allFormData.additionalSkills);
      
      const fifthStepData = {
        additionalSkills: allFormData.additionalSkills
      };
      const resp = await submitFifthStep(fifthStepData, parentProfileId);
      console.log("step5 ifError", resp)

    }
    
    if (allFormData.education) {
      console.log("Step 6 - Education:", allFormData.education);
      
      const sixthStepData = {
        education: allFormData.education
      };
      const resp = await submitSixStep(sixthStepData, parentProfileId);
    }
    
    console.log("\n=== SUMMARY ===");
    console.log("Total steps completed:", Object.keys(allFormData).length);
    console.log("Form data keys:", Object.keys(allFormData));
    console.log("========================\n");

    // Update form data and proceed to next step
    setFormData(allFormData);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.45]
      }}
      className="w-full max-w-3xl mx-auto bg-card rounded-xl"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.45]
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Your Education Background
        </h1>
        <p className="text-xs text-center text-muted-foreground mb-6">
          Share your educational journey and qualifications
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Education Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.45]
          }}
          className="bg-content1 rounded-lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              {isCustomProfession ? (
                <Input
                  variant="bordered"
                  label="Profession"
                  placeholder="Enter your custom profession"
                  {...register("profession")}
                  errorMessage={errors.profession?.message}
                  isInvalid={!!errors.profession}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                />
              ) : (
                <Autocomplete
                  label="Profession"
                  variant="bordered"
                  placeholder="Select your profession"
                  defaultItems={onlineProfessions}
                  selectedKey={watch("profession")}
                  onSelectionChange={handleProfessionChange}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                  allowsCustomValue
                  onInputChange={(value) => {
                    // This enables search functionality
                  }}
                >
                  {(profession) => (
                    <AutocompleteItem key={profession.value} textValue={profession.label}>
                      {profession.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
              {errors.profession && (
                <p className="text-xs text-danger">{errors.profession.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Autocomplete
                  label="Country"
                  variant="bordered"
                  placeholder="Select country"
                  defaultItems={countries}
                  selectedKey={watch("country")}
                  onSelectionChange={handleCountryChange}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                  allowsCustomValue
                  onInputChange={(value) => {
                    // This enables search functionality
                  }}
                >
                  {(country) => (
                    <AutocompleteItem key={country.value} textValue={country.label}>
                      {country.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {errors.country && (
                  <p className="text-xs text-danger">{errors.country.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Input
                  variant="bordered"
                  label="School/Institution"
                  placeholder="e.g., Harvard University"
                  {...register("school")}
                  errorMessage={errors.school?.message}
                  isInvalid={!!errors.school}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Select
                  label="Education Level"
                  variant="bordered"
                  placeholder="Select level"
                  selectedKeys={watch("educationLevel") ? new Set([watch("educationLevel")]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setValue("educationLevel", selected, { shouldValidate: true });
                  }}
                  size="sm"
                  classNames={{
                    trigger: "text-sm",
                    label: "text-xs font-medium",
                  }}
                >
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.educationLevel && (
                  <p className="text-xs text-danger">{errors.educationLevel.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <DatePicker
                  label="Start Date"
                  variant="bordered"
                  onChange={(date) => {
                    if (date) {
                      const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                      setValue("startDate", dateString, { shouldValidate: true });
                    } else {
                      setValue("startDate", "", { shouldValidate: true });
                    }
                  }}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                  isInvalid={!!errors.startDate}
                  errorMessage={errors.startDate?.message}
                  maxValue={today(getLocalTimeZone())}
                />
              </div>
              <div className="space-y-1">
                <DatePicker
                  label="End Date"
                  variant="bordered"
                  onChange={(date) => {
                    if (date) {
                      const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                      setValue("endDate", dateString, { shouldValidate: true });
                    } else {
                      setValue("endDate", "", { shouldValidate: true });
                    }
                  }}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                  isInvalid={!!errors.endDate}
                  errorMessage={errors.endDate?.message}
                  maxValue={today(getLocalTimeZone())}
                  minValue={watch("startDate") ? parseDate(watch("startDate")) : undefined}
                />
              </div>
            </div>
          </form>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.45]
          }}
        >
          <Button
            onPress={handleSubmit(onSubmit)}
            className="px-6 flex flex-row items-center justify-center gap-2 py-2 w-full bg-primary text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium hover:bg-primary/90"
          >
            <p className="text-sm font-medium">Next</p>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SixStep;
