"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem, DatePicker, Autocomplete, AutocompleteItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { sixStepResolver } from "../../resolvers/createProfileResolvers";
import submitCompleteProfile from "../../appwriteUtils/createProfileAppwrite/submitCompleteProfile";
const SixStep = ({ onNext, onBack, formData, setFormData, onboardingId }) => {
  const [isCustomProfession, setIsCustomProfession] = useState(false);

  // Helper function to safely parse dates
  const safeParseDateString = (dateString) => {
    try {
      if (!dateString || dateString.trim() === '') return null;
      // Ensure the date string is in proper ISO format (YYYY-MM-DD)
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parts[0].padStart(4, '0'); // Pad year to 4 digits
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return parseDate(formattedDate);
      }
      return null;
    } catch (error) {
      console.warn('Error parsing date string:', dateString, error);
      return null;
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
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
    { value: "af", label: "Afghanistan" },
    { value: "al", label: "Albania" },
    { value: "dz", label: "Algeria" },
    { value: "ad", label: "Andorra" },
    { value: "ao", label: "Angola" },
    { value: "ag", label: "Antigua and Barbuda" },
    { value: "ar", label: "Argentina" },
    { value: "am", label: "Armenia" },
    { value: "au", label: "Australia" },
    { value: "at", label: "Austria" },
    { value: "az", label: "Azerbaijan" },
    { value: "bs", label: "Bahamas" },
    { value: "bh", label: "Bahrain" },
    { value: "bd", label: "Bangladesh" },
    { value: "bb", label: "Barbados" },
    { value: "by", label: "Belarus" },
    { value: "be", label: "Belgium" },
    { value: "bz", label: "Belize" },
    { value: "bj", label: "Benin" },
    { value: "bt", label: "Bhutan" },
    { value: "bo", label: "Bolivia" },
    { value: "ba", label: "Bosnia and Herzegovina" },
    { value: "bw", label: "Botswana" },
    { value: "br", label: "Brazil" },
    { value: "bn", label: "Brunei" },
    { value: "bg", label: "Bulgaria" },
    { value: "bf", label: "Burkina Faso" },
    { value: "bi", label: "Burundi" },
    { value: "cv", label: "Cabo Verde" },
    { value: "kh", label: "Cambodia" },
    { value: "cm", label: "Cameroon" },
    { value: "ca", label: "Canada" },
    { value: "cf", label: "Central African Republic" },
    { value: "td", label: "Chad" },
    { value: "cl", label: "Chile" },
    { value: "cn", label: "China" },
    { value: "co", label: "Colombia" },
    { value: "km", label: "Comoros" },
    { value: "cg", label: "Congo" },
    { value: "cr", label: "Costa Rica" },
    { value: "hr", label: "Croatia" },
    { value: "cu", label: "Cuba" },
    { value: "cy", label: "Cyprus" },
    { value: "cz", label: "Czech Republic" },
    { value: "cd", label: "Democratic Republic of the Congo" },
    { value: "dk", label: "Denmark" },
    { value: "dj", label: "Djibouti" },
    { value: "dm", label: "Dominica" },
    { value: "do", label: "Dominican Republic" },
    { value: "ec", label: "Ecuador" },
    { value: "eg", label: "Egypt" },
    { value: "sv", label: "El Salvador" },
    { value: "gq", label: "Equatorial Guinea" },
    { value: "er", label: "Eritrea" },
    { value: "ee", label: "Estonia" },
    { value: "sz", label: "Eswatini" },
    { value: "et", label: "Ethiopia" },
    { value: "fj", label: "Fiji" },
    { value: "fi", label: "Finland" },
    { value: "fr", label: "France" },
    { value: "ga", label: "Gabon" },
    { value: "gm", label: "Gambia" },
    { value: "ge", label: "Georgia" },
    { value: "de", label: "Germany" },
    { value: "gh", label: "Ghana" },
    { value: "gr", label: "Greece" },
    { value: "gd", label: "Grenada" },
    { value: "gt", label: "Guatemala" },
    { value: "gn", label: "Guinea" },
    { value: "gw", label: "Guinea-Bissau" },
    { value: "gy", label: "Guyana" },
    { value: "ht", label: "Haiti" },
    { value: "hn", label: "Honduras" },
    { value: "hu", label: "Hungary" },
    { value: "is", label: "Iceland" },
    { value: "in", label: "India" },
    { value: "id", label: "Indonesia" },
    { value: "ir", label: "Iran" },
    { value: "iq", label: "Iraq" },
    { value: "ie", label: "Ireland" },
    { value: "il", label: "Israel" },
    { value: "it", label: "Italy" },
    { value: "jm", label: "Jamaica" },
    { value: "jp", label: "Japan" },
    { value: "jo", label: "Jordan" },
    { value: "kz", label: "Kazakhstan" },
    { value: "ke", label: "Kenya" },
    { value: "ki", label: "Kiribati" },
    { value: "kw", label: "Kuwait" },
    { value: "kg", label: "Kyrgyzstan" },
    { value: "la", label: "Laos" },
    { value: "lv", label: "Latvia" },
    { value: "lb", label: "Lebanon" },
    { value: "ls", label: "Lesotho" },
    { value: "lr", label: "Liberia" },
    { value: "ly", label: "Libya" },
    { value: "li", label: "Liechtenstein" },
    { value: "lt", label: "Lithuania" },
    { value: "lu", label: "Luxembourg" },
    { value: "mg", label: "Madagascar" },
    { value: "mw", label: "Malawi" },
    { value: "my", label: "Malaysia" },
    { value: "mv", label: "Maldives" },
    { value: "ml", label: "Mali" },
    { value: "mt", label: "Malta" },
    { value: "mh", label: "Marshall Islands" },
    { value: "mr", label: "Mauritania" },
    { value: "mu", label: "Mauritius" },
    { value: "mx", label: "Mexico" },
    { value: "fm", label: "Micronesia" },
    { value: "md", label: "Moldova" },
    { value: "mc", label: "Monaco" },
    { value: "mn", label: "Mongolia" },
    { value: "me", label: "Montenegro" },
    { value: "ma", label: "Morocco" },
    { value: "mz", label: "Mozambique" },
    { value: "mm", label: "Myanmar" },
    { value: "na", label: "Namibia" },
    { value: "nr", label: "Nauru" },
    { value: "np", label: "Nepal" },
    { value: "nl", label: "Netherlands" },
    { value: "nz", label: "New Zealand" },
    { value: "ni", label: "Nicaragua" },
    { value: "ne", label: "Niger" },
    { value: "ng", label: "Nigeria" },
    { value: "no", label: "Norway" },
    { value: "om", label: "Oman" },
    { value: "pk", label: "Pakistan" },
    { value: "pw", label: "Palau" },
    { value: "pa", label: "Panama" },
    { value: "pg", label: "Papua New Guinea" },
    { value: "py", label: "Paraguay" },
    { value: "pe", label: "Peru" },
    { value: "ph", label: "Philippines" },
    { value: "pl", label: "Poland" },
    { value: "pt", label: "Portugal" },
    { value: "qa", label: "Qatar" },
    { value: "ro", label: "Romania" },
    { value: "ru", label: "Russia" },
    { value: "rw", label: "Rwanda" },
    { value: "kn", label: "Saint Kitts and Nevis" },
    { value: "lc", label: "Saint Lucia" },
    { value: "vc", label: "Saint Vincent and the Grenadines" },
    { value: "ws", label: "Samoa" },
    { value: "sm", label: "San Marino" },
    { value: "st", label: "Sao Tome and Principe" },
    { value: "sa", label: "Saudi Arabia" },
    { value: "sn", label: "Senegal" },
    { value: "rs", label: "Serbia" },
    { value: "sc", label: "Seychelles" },
    { value: "sl", label: "Sierra Leone" },
    { value: "sg", label: "Singapore" },
    { value: "sk", label: "Slovakia" },
    { value: "si", label: "Slovenia" },
    { value: "sb", label: "Solomon Islands" },
    { value: "so", label: "Somalia" },
    { value: "za", label: "South Africa" },
    { value: "kr", label: "South Korea" },
    { value: "ss", label: "South Sudan" },
    { value: "es", label: "Spain" },
    { value: "lk", label: "Sri Lanka" },
    { value: "sd", label: "Sudan" },
    { value: "sr", label: "Suriname" },
    { value: "se", label: "Sweden" },
    { value: "ch", label: "Switzerland" },
    { value: "sy", label: "Syria" },
    { value: "tw", label: "Taiwan" },
    { value: "tj", label: "Tajikistan" },
    { value: "tz", label: "Tanzania" },
    { value: "th", label: "Thailand" },
    { value: "tl", label: "Timor-Leste" },
    { value: "tg", label: "Togo" },
    { value: "to", label: "Tonga" },
    { value: "tt", label: "Trinidad and Tobago" },
    { value: "tn", label: "Tunisia" },
    { value: "tr", label: "Turkey" },
    { value: "tm", label: "Turkmenistan" },
    { value: "tv", label: "Tuvalu" },
    { value: "ug", label: "Uganda" },
    { value: "ua", label: "Ukraine" },
    { value: "ae", label: "United Arab Emirates" },
    { value: "uk", label: "United Kingdom" },
    { value: "us", label: "United States" },
    { value: "uy", label: "Uruguay" },
    { value: "uz", label: "Uzbekistan" },
    { value: "vu", label: "Vanuatu" },
    { value: "va", label: "Vatican City" },
    { value: "ve", label: "Venezuela" },
    { value: "vn", label: "Vietnam" },
    { value: "ye", label: "Yemen" },
    { value: "zm", label: "Zambia" },
    { value: "zw", label: "Zimbabwe" },
    { value: "other", label: "Other" },
  ];

  const educationLevels = [
    { value: "high_school", label: "High School" },
    { value: "associate", label: "Associate Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate/PhD" },
    { value: "certificate", label: "Certificate" },
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
    let parentProfileId = onboardingId;
    console.log("NEW ID", parentProfileId)
    const allFormData = {
      ...formData, // Data from previous steps (FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep)
      education: data // Data from current step (SixStep)
    };

    const resp = await submitCompleteProfile(allFormData, parentProfileId);
    console.log( resp)


    // Update form data and proceed to next step
    setFormData(allFormData);
    // onNext();
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
                  value={safeParseDateString(watch("startDate"))}
                  onChange={(date) => {
                    if (date) {
                      const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                      setValue("startDate", dateString, { shouldValidate: true });
                    } else {
                      setValue("startDate", "", { shouldValidate: true });
                    }
                  }}
                  onDateChange={(date) => {
                    // Handle manual input more gracefully
                    try {
                      if (date) {
                        const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                        setValue("startDate", dateString, { shouldValidate: true });
                      } else {
                        setValue("startDate", "", { shouldValidate: true });
                      }
                    } catch (error) {
                      console.warn("Invalid date format:", error);
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
                  granularity="day"
                  showMonthAndYearPickers
                />
              </div>
              <div className="space-y-1">
                <DatePicker
                  label="End Date"
                  variant="bordered"
                  value={safeParseDateString(watch("endDate"))}
                  onChange={(date) => {
                    if (date) {
                      const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                      setValue("endDate", dateString, { shouldValidate: true });
                    } else {
                      setValue("endDate", "", { shouldValidate: true });
                    }
                  }}
                  onDateChange={(date) => {
                    // Handle manual input more gracefully
                    try {
                      if (date) {
                        const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                        setValue("endDate", dateString, { shouldValidate: true });
                      } else {
                        setValue("endDate", "", { shouldValidate: true });
                      }
                    } catch (error) {
                      console.warn("Invalid date format:", error);
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
                  minValue={safeParseDateString(watch("startDate"))}
                  granularity="day"
                  showMonthAndYearPickers
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
          className="flex justify-between gap-4"
        >
          <Button
            onPress={onBack}
            className="flex-1 p-2 flex flex-row items-center justify-center gap-2 bg-default text-secondary-foreground rounded-lg hover: transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-small text-small">
            <ArrowLeft className="w-4 h-4" />
            <p className="text-sm font-medium">Back</p>
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            className="flex-1 px-6 flex flex-row items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium hover:bg-primary/90"
          >
            <p className="text-sm font-medium">
              {isSubmitting? "":"Submit"}
            </p>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SixStep;
