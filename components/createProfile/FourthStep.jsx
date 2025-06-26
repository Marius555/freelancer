"use client";

import React, { useState, useEffect } from "react";
import { Input, Select, SelectItem, Checkbox, Chip, DatePicker } from "@heroui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, CheckCircle } from "lucide-react";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

const formSchema = yup.object({
  occupation: yup.string().required("Please select an occupation"),
  startDate: yup.mixed().required("Start date is required").test('is-valid-date', 'Start date is required', function(value) {
    // Check if value is a valid Date object or CalendarDate object
    if (!value) return false;
    if (value instanceof Date) return !isNaN(value.getTime());
    if (value && typeof value === 'object' && value.year && value.month && value.day) {
      return true; // CalendarDate object
    }
    return false;
  }),
  endDate: yup.mixed().nullable().test('end-date-or-currently-working', 'Please provide an end date or check "Currently working in this role"', function(value) {
    const { isCurrentlyWorking } = this.parent;
    
    // If currently working is checked, end date is not required
    if (isCurrentlyWorking) {
      return true;
    }
    
    // If not currently working, end date is required
    if (!value) {
      return false;
    }
    
    // Validate end date format
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (value && typeof value === 'object' && value.year && value.month && value.day) {
      return true; // CalendarDate object
    }
    
    return false;
  }),
  skills: yup.array().min(2, "Please select at least 2 specializations").max(5, "You can select up to 5 specializations"),
  isCurrentlyWorking: yup.boolean(),
});

// Comprehensive list of online jobs/occupations
const occupations = [
  { key: "web-development", label: "Web Development", category: "Programming & Tech" },
  { key: "mobile-development", label: "Mobile Development", category: "Programming & Tech" },
  { key: "software-development", label: "Software Development", category: "Programming & Tech" },
  { key: "data-science", label: "Data Science", category: "Programming & Tech" },
  { key: "ai-ml", label: "AI & Machine Learning", category: "Programming & Tech" },
  { key: "cybersecurity", label: "Cybersecurity", category: "Programming & Tech" },
  { key: "graphic-design", label: "Graphic Design", category: "Design & Creative" },
  { key: "ui-ux-design", label: "UI/UX Design", category: "Design & Creative" },
  { key: "logo-design", label: "Logo Design", category: "Design & Creative" },
  { key: "illustration", label: "Illustration", category: "Design & Creative" },
  { key: "video-editing", label: "Video Editing", category: "Design & Creative" },
  { key: "animation", label: "Animation", category: "Design & Creative" },
  { key: "content-writing", label: "Content Writing", category: "Digital Marketing" },
  { key: "copywriting", label: "Copywriting", category: "Digital Marketing" },
  { key: "seo", label: "SEO", category: "Digital Marketing" },
  { key: "social-media", label: "Social Media Management", category: "Digital Marketing" },
  { key: "email-marketing", label: "Email Marketing", category: "Digital Marketing" },
  { key: "ppc-advertising", label: "PPC Advertising", category: "Digital Marketing" },
  { key: "virtual-assistant", label: "Virtual Assistant", category: "Business" },
  { key: "data-entry", label: "Data Entry", category: "Business" },
  { key: "translation", label: "Translation", category: "Business" },
  { key: "voice-over", label: "Voice Over", category: "Business" },
  { key: "transcription", label: "Transcription", category: "Business" },
  { key: "research", label: "Research", category: "Business" },
  { key: "consulting", label: "Consulting", category: "Business" },
  { key: "accounting", label: "Accounting", category: "Business" },
  { key: "legal-services", label: "Legal Services", category: "Business" },
  { key: "teaching", label: "Online Teaching", category: "Education" },
  { key: "tutoring", label: "Tutoring", category: "Education" },
  { key: "course-creation", label: "Course Creation", category: "Education" },
  { key: "photography", label: "Photography", category: "Lifestyle" },
  { key: "fitness-training", label: "Fitness Training", category: "Lifestyle" },
  { key: "nutrition", label: "Nutrition", category: "Lifestyle" },
  { key: "music-production", label: "Music Production", category: "Lifestyle" },
  { key: "podcast-editing", label: "Podcast Editing", category: "Lifestyle" },
];

// Skills mapping for each occupation
const occupationSkills = {
  "web-development": [
    "HTML/CSS", "JavaScript", "React", "Vue.js", "Angular", "Node.js", "Python", "PHP", "WordPress", "Shopify", "API Development", "Database Design", "Git", "Docker", "AWS", "Responsive Design"
  ],
  "mobile-development": [
    "React Native", "Flutter", "Swift", "Kotlin", "Java", "iOS Development", "Android Development", "Mobile UI/UX", "App Store Optimization", "Firebase", "Push Notifications", "Mobile Testing"
  ],
  "software-development": [
    "Java", "C++", "C#", "Python", "JavaScript", "TypeScript", "Go", "Rust", "System Design", "Algorithms", "Data Structures", "Testing", "CI/CD", "Microservices", "Cloud Computing"
  ],
  "data-science": [
    "Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Data Visualization", "Statistical Analysis", "Machine Learning", "Deep Learning", "Big Data", "Apache Spark"
  ],
  "ai-ml": [
    "Python", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Natural Language Processing", "Computer Vision", "Neural Networks", "Deep Learning", "Reinforcement Learning", "Model Deployment", "MLOps"
  ],
  "cybersecurity": [
    "Network Security", "Penetration Testing", "Ethical Hacking", "Security Auditing", "Incident Response", "Cryptography", "Security Tools", "Compliance", "Risk Assessment", "Security Architecture"
  ],
  "graphic-design": [
    "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Canva", "Typography", "Color Theory", "Layout Design", "Brand Identity", "Print Design", "Digital Design", "Logo Design", "Illustration"
  ],
  "ui-ux-design": [
    "Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "User Testing", "Information Architecture", "Interaction Design", "Visual Design", "Design Systems", "Accessibility"
  ],
  "logo-design": [
    "Adobe Illustrator", "Adobe Photoshop", "Typography", "Color Theory", "Brand Identity", "Vector Graphics", "Logo Variations", "Style Guides", "Brand Guidelines", "Creative Concept Development"
  ],
  "illustration": [
    "Adobe Illustrator", "Procreate", "Digital Painting", "Character Design", "Concept Art", "Storyboarding", "Vector Illustration", "Traditional Art", "Comic Art", "Children's Book Illustration"
  ],
  "video-editing": [
    "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "After Effects", "Motion Graphics", "Color Grading", "Sound Design", "Video Compression", "Storytelling", "Cinematography"
  ],
  "animation": [
    "Adobe After Effects", "Blender", "Maya", "Cinema 4D", "2D Animation", "3D Animation", "Motion Graphics", "Character Animation", "Rigging", "Storyboarding", "Animation Principles"
  ],
  "content-writing": [
    "Blog Writing", "Article Writing", "Copywriting", "SEO Writing", "Technical Writing", "Creative Writing", "Editing", "Proofreading", "Content Strategy", "Research", "Ghostwriting"
  ],
  "copywriting": [
    "Sales Copy", "Marketing Copy", "Ad Copy", "Email Copy", "Landing Page Copy", "Brand Voice", "Persuasive Writing", "A/B Testing", "Conversion Optimization", "Creative Concepts"
  ],
  "seo": [
    "Keyword Research", "On-Page SEO", "Technical SEO", "Link Building", "Content Strategy", "Local SEO", "E-commerce SEO", "Analytics", "Google Search Console", "Schema Markup"
  ],
  "social-media": [
    "Content Creation", "Community Management", "Paid Advertising", "Analytics", "Strategy Development", "Platform Management", "Influencer Marketing", "Trend Analysis", "Brand Voice", "Crisis Management"
  ],
  "email-marketing": [
    "Email Automation", "List Building", "A/B Testing", "Template Design", "Segmentation", "Analytics", "Compliance", "Campaign Strategy", "Drip Campaigns", "Newsletter Management"
  ],
  "ppc-advertising": [
    "Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads", "Campaign Management", "Keyword Research", "Ad Copy", "Landing Page Optimization", "Analytics", "ROI Optimization"
  ],
  "virtual-assistant": [
    "Email Management", "Calendar Management", "Data Entry", "Customer Service", "Project Management", "Social Media Management", "Research", "Administrative Tasks", "Communication", "Organization"
  ],
  "data-entry": [
    "Excel", "Google Sheets", "Database Management", "Data Cleaning", "Data Validation", "Typing Speed", "Accuracy", "Attention to Detail", "Time Management", "Quality Control"
  ],
  "translation": [
    "Multiple Languages", "Cultural Adaptation", "Technical Translation", "Legal Translation", "Medical Translation", "Localization", "Proofreading", "Quality Assurance", "CAT Tools", "Specialized Terminology"
  ],
  "voice-over": [
    "Voice Acting", "Audio Recording", "Audio Editing", "Script Reading", "Character Voices", "Accent Work", "Audio Equipment", "Post-Production", "Voice Direction", "Studio Recording"
  ],
  "transcription": [
    "Audio Transcription", "Video Transcription", "Medical Transcription", "Legal Transcription", "Academic Transcription", "Time Coding", "Quality Control", "Formatting", "Accuracy", "Speed"
  ],
  "research": [
    "Market Research", "Competitive Analysis", "Data Collection", "Survey Design", "Interviewing", "Report Writing", "Statistical Analysis", "Primary Research", "Secondary Research", "Presentation"
  ],
  "consulting": [
    "Business Strategy", "Process Improvement", "Change Management", "Project Management", "Financial Analysis", "Market Analysis", "Risk Assessment", "Performance Optimization", "Strategic Planning", "Implementation"
  ],
  "accounting": [
    "Bookkeeping", "Financial Statements", "Tax Preparation", "QuickBooks", "Excel", "Payroll", "Auditing", "Financial Analysis", "Compliance", "Cost Accounting"
  ],
  "legal-services": [
    "Contract Review", "Legal Research", "Document Preparation", "Compliance", "Intellectual Property", "Corporate Law", "Employment Law", "Real Estate Law", "Litigation Support", "Legal Writing"
  ],
  "teaching": [
    "Curriculum Development", "Lesson Planning", "Student Assessment", "Online Teaching Tools", "Subject Expertise", "Pedagogy", "Student Engagement", "Progress Tracking", "Parent Communication", "Educational Technology"
  ],
  "tutoring": [
    "Subject Expertise", "Individualized Instruction", "Test Preparation", "Homework Help", "Study Skills", "Academic Support", "Progress Monitoring", "Learning Assessment", "Motivation", "Adaptive Teaching"
  ],
  "course-creation": [
    "Curriculum Design", "Content Creation", "Video Production", "Learning Management Systems", "Assessment Design", "Instructional Design", "Engagement Strategies", "Course Marketing", "Student Support", "Quality Assurance"
  ],
  "photography": [
    "Portrait Photography", "Event Photography", "Product Photography", "Photo Editing", "Lightroom", "Photoshop", "Composition", "Lighting", "Equipment Knowledge", "Post-Processing"
  ],
  "fitness-training": [
    "Personal Training", "Workout Programming", "Nutrition Guidance", "Fitness Assessment", "Motivation", "Injury Prevention", "Online Coaching", "Progress Tracking", "Exercise Form", "Health Education"
  ],
  "nutrition": [
    "Meal Planning", "Nutritional Analysis", "Dietary Counseling", "Supplement Guidance", "Health Coaching", "Recipe Development", "Food Safety", "Specialized Diets", "Behavioral Change", "Wellness Education"
  ],
  "music-production": [
    "DAW Software", "Audio Engineering", "Mixing", "Mastering", "Sound Design", "Music Theory", "Arrangement", "Recording", "Plugin Knowledge", "Genre Expertise"
  ],
  "podcast-editing": [
    "Audio Editing", "Noise Reduction", "Audio Enhancement", "Episode Assembly", "Show Notes", "Podcast Hosting", "Distribution", "Analytics", "Interview Editing", "Sound Design"
  ],
};

const FourthStep = ({ onNext, formData, setFormData }) => {
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: formData || {
      occupation: "",
      startDate: null,
      endDate: null,
      skills: [],
      isCurrentlyWorking: false,
    },
  });

  const watchedOccupation = watch("occupation");
  const watchedStartDate = watch("startDate");

  useEffect(() => {
    if (watchedOccupation) {
      setSelectedOccupation(watchedOccupation);
      setSelectedSkills([]);
      setValue("skills", []);
    }
  }, [watchedOccupation, setValue]);



  // Get user's timezone
  const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  // Calculate years of experience based on dates
  const calculateYearsOfExperience = () => {
    if (!startDate) return 0;
    
    const end = isCurrentlyWorking ? new Date() : endDate;
    if (!end) return 0;
    
    const start = new Date(startDate);
    const endDateTime = new Date(end);
    
    // Calculate the difference in years
    let years = endDateTime.getFullYear() - start.getFullYear();
    const monthDiff = endDateTime.getMonth() - start.getMonth();
    
    // Adjust for partial years
    if (monthDiff < 0 || (monthDiff === 0 && endDateTime.getDate() < start.getDate())) {
      years--;
    }
    
    // Return at least 0 years
    return Math.max(0, years);
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    // Limit to 5 specializations
    if (updatedSkills.length > 5) {
      return;
    }
    
    setSelectedSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Convert CalendarDate to JavaScript Date for form validation
    if (date) {
      const jsDate = new Date(date.year, date.month - 1, date.day);
      setValue("startDate", jsDate, { shouldValidate: true });
    } else {
      setValue("startDate", null, { shouldValidate: true });
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // Convert CalendarDate to JavaScript Date for form validation
    if (date) {
      const jsDate = new Date(date.year, date.month - 1, date.day);
      setValue("endDate", jsDate, { shouldValidate: true });
    } else {
      setValue("endDate", null, { shouldValidate: true });
    }
  };

  const handleSubmitForm = (data) => {
    const yearsOfExperience = calculateYearsOfExperience();
    const formDataToSave = {
      ...data,
      skills: selectedSkills,
      isCurrentlyWorking: isCurrentlyWorking,
      startDate: startDate,
      endDate: endDate,
      yearsOfExperience: yearsOfExperience,
      timezone: getUserTimezone(),
    };
    setFormData(formDataToSave);
    onNext();
  };

  const groupedOccupations = occupations.reduce((acc, occupation) => {
    if (!acc[occupation.category]) {
      acc[occupation.category] = [];
    }
    acc[occupation.category].push(occupation);
    return acc;
  }, {});

  const yearsOfExperience = calculateYearsOfExperience();

  // Calculate min and max values for end date
  const getEndDateMinValue = () => {
    if (!startDate) return undefined;
    const start = new Date(startDate);
    return new CalendarDate(start.getFullYear(), start.getMonth() + 1, start.getDate());
  };

  const getEndDateMaxValue = () => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setFullYear(currentDate.getFullYear() + 1);
    return new CalendarDate(maxDate.getFullYear(), maxDate.getMonth() + 1, maxDate.getDate());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4 bg-card rounded-xl shadow-lg h-full flex flex-col"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Your Professional Experience
        </h1>
        <p className="text-xs text-center text-muted-foreground mb-4">
          Tell us about your occupation and skills
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="flex-1 flex flex-col space-y-4">
        {/* Occupation and Date Selection */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 flex-shrink-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Professional Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Select
                label="Choose your occupation"
                variant="faded"
                placeholder="Select an occupation"
                selectedKeys={selectedOccupation ? [selectedOccupation] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setValue("occupation", selected, { shouldValidate: true });
                }}
                errorMessage={errors.occupation?.message}
                isInvalid={!!errors.occupation}
                classNames={{
                  trigger: "h-10",
                  label: "text-xs font-medium",
                }}
              >
                {Object.entries(groupedOccupations).map(([category, categoryOccupations]) => 
                  categoryOccupations.map((occupation) => (
                    <SelectItem key={occupation.key} textValue={occupation.label}>
                      {occupation.label}
                    </SelectItem>
                  ))
                )}
              </Select>
            </div>
            
            <div className="space-y-1">
              <DatePicker
                label="Start Date"
                variant="faded"
                value={startDate}
                onChange={handleStartDateChange}
                errorMessage={errors.startDate?.message}
                isInvalid={!!errors.startDate}
                classNames={{
                  base: "w-full",
                  popoverContent: "w-auto",
                  label: "text-xs font-medium",
                }}
              />
            </div>
            
            <div className="space-y-1">
              <DatePicker
                label="End Date"
                variant="faded"
                value={endDate}
                onChange={handleEndDateChange}
                isDisabled={isCurrentlyWorking}
                minValue={getEndDateMinValue()}
                maxValue={getEndDateMaxValue()}
                errorMessage={errors.endDate?.message}
                isInvalid={!!errors.endDate}
                classNames={{
                  base: "w-full",
                  popoverContent: "w-auto",
                  label: "text-xs font-medium",
                }}
              />
              
            </div>
          </div>
          
          <div className="flex items-center gap-2 justify-self-start">
            <Checkbox
              isSelected={isCurrentlyWorking}
              onValueChange={(checked) => {
                setIsCurrentlyWorking(checked);
                setValue("isCurrentlyWorking", checked, { shouldValidate: true });
              }}
              size="sm"
            >
              <span className="text-xs">Currently working in this role</span>
            </Checkbox>
            
            {/* Years of Experience Display */}
            {(startDate || endDate || isCurrentlyWorking) && (
              <div className="ml-auto p-2 bg-primary/10 rounded-lg">
                <p className="text-xs text-primary font-medium">
                  Years of Experience: {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Specializations Selection */}
        {selectedOccupation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 flex-1 flex flex-col min-h-0"
          >
            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Fields You Specialize In</h2>
              <span className="text-xs text-muted-foreground">
                (Select 2-5 specializations that best represent your expertise in this field)
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 flex-1 overflow-y-auto min-h-0">
              {occupationSkills[selectedOccupation]?.map((skill) => (
                <Checkbox
                  key={skill}
                  isSelected={selectedSkills.includes(skill)}
                  onValueChange={() => handleSkillToggle(skill)}
                  isDisabled={selectedSkills.length >= 5 && !selectedSkills.includes(skill)}
                  classNames={{
                    label: "text-xs",
                  }}
                >
                  {skill}
                </Checkbox>
              ))}
            </div>
            
            {errors.skills && (
              <p className="text-danger text-xs mt-1 flex-shrink-0">{errors.skills.message}</p>
            )}
            
            {selectedSkills.length > 0 && (
              <div className="mt-2 flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-1">
                  Selected Specializations ({selectedSkills.length}/5):
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedSkills.map((skill) => (
                    <Chip
                      key={skill}
                      variant="flat"
                      color="primary"
                      onClose={() => handleSkillToggle(skill)}
                      className="text-xs"
                      size="sm"
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            
            {selectedSkills.length >= 5 && (
              <div className="mt-1 p-1 bg-warning/10 rounded-lg flex-shrink-0">
                <p className="text-xs text-warning">
                  Maximum of 5 specializations reached. Deselect one to add another.
                </p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end flex-shrink-0 pt-2"
        >
          <button
            type="submit"
            className="px-6 flex flex-row items-center justify-center gap-2 py-2.5 w-full bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium text-base"
          >
            <p className="text-base font-medium">Next</p>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default FourthStep; 