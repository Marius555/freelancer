"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Chip, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, X } from "lucide-react";
import { fifthStepResolver } from "../../resolvers/createProfileResolvers";

const FifthStep = ({ onNext, formData, setFormData }) => {
  const [skills, setSkills] = useState([]);
  const [skillCounter, setSkillCounter] = useState(0);

  // Ensure all skills have unique IDs on component mount
  useEffect(() => {
    if (formData?.additionalSkills && formData.additionalSkills.length > 0) {
      // Filter out invalid skills and ensure all have unique IDs
      const validSkills = formData.additionalSkills
        .filter(skill => skill.skillName && skill.proficiency && skill.proficiency >= 1 && skill.proficiency <= 5)
        .map((skill, index) => ({
          ...skill,
          id: skill.id || `skill-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
        }));
      setSkills(validSkills);
      setSkillCounter(validSkills.length);
    }
  }, [formData?.additionalSkills]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: fifthStepResolver,
    defaultValues: {
      skillName: "",
      proficiency: 3,
    },
  });

  const watchedProficiency = watch("proficiency");

  const proficiencyLevels = [
    { value: 1, label: "Beginner", color: "danger" },
    { value: 2, label: "Elementary", color: "warning" },
    { value: 3, label: "Intermediate", color: "default" },
    { value: 4, label: "Advanced", color: "primary" },
    { value: 5, label: "Expert", color: "success" },
  ];

  const getProficiencyColor = (level) => {
    const proficiency = proficiencyLevels.find(p => p.value === level);
    return proficiency?.color || "default";
  };

  const getProficiencyLabel = (level) => {
    const proficiency = proficiencyLevels.find(p => p.value === level);
    return proficiency?.label || "Unknown";
  };

  const onSubmit = (data) => {
    if (skills.length >= 5) {
      alert("Maximum 5 skills allowed");
      return;
    }
    const newSkill = {
      id: `skill-${Date.now()}-${skillCounter}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
    };
    setSkillCounter(prev => prev + 1);
    setSkills(prev => [...prev, newSkill]);
    reset();
  };

  const removeSkill = (skillId) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const handleNext = () => {
    if (skills.length === 0) {
      alert("Please add at least one skill");
      return;
    }
    setFormData({ ...formData, additionalSkills: skills });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.45] // Custom cubic-bezier for smooth motion
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
          Your Skills & Expertise
        </h1>
        <p className="text-xs text-center text-muted-foreground mb-6">
          Showcase your skills and let clients know what you're capable of
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Add Skill Form - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            ease: [0.25, 0.46, 0.45,  0.45]
          }}
          className="bg-content1 rounded-lg"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Add New Skill
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-5 space-y-1">
                <Input
                  variant="bordered"
                  label="Skill Name"
                  placeholder="e.g., Voice Over"
                  {...register("skillName")}
                  errorMessage={errors.skillName?.message}
                  isInvalid={!!errors.skillName}
                  size="sm"
                  classNames={{
                    input: "text-sm",
                    label: "text-xs font-medium",
                  }}
                />
              </div>
              <div className="md:col-span-5 space-y-1">
                <Select
                  label="Proficiency Level"
                  variant="bordered"
                  placeholder="Select your proficiency"
                  selectedKeys={watchedProficiency ? new Set([watchedProficiency.toString()]) : new Set()}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setValue("proficiency", parseInt(selected), { shouldValidate: true });
                  }}
                  size="sm"
                  classNames={{
                    trigger: "text-sm",
                    label: "text-xs font-medium",
                  }}
                >
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level.value.toString()} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-center">
                <Button
                  type="submit"
                  isIconOnly
                  size="lg"
                  className="bg-default text-primary-foreground hover:bg-primary/80 transition-all duration-300 transform  rounded-full"
                  disabled={skills.length >= 5}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Skills List */}
        <AnimatePresence mode="wait">
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-foreground">
                Your Skills ({skills.length})
              </h3>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -50, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 15, scale: 0.98 }}
                      transition={{ 
                        duration: 0.1,
                        delay: index * 0.02,
                        ease: [0.25, 0.46, 0.45, 0.45]
                      }}
                      className="p-3 bg-content1 rounded-lg border border-content2 hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-semibold text-foreground">
                            {skill.skillName}
                          </h4>
                          <Chip
                            color={getProficiencyColor(skill.proficiency)}
                            variant="flat"
                            size="sm"
                            classNames={{
                              content: "text-xs",
                            }}
                          >
                            {getProficiencyLabel(skill.proficiency)} ({skill.proficiency}/5)
                          </Chip>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => removeSkill(skill.id)}
                          className="text-danger hover:text-danger/80 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <Button
            onPress={handleNext}
            disabled={skills.length === 0}
            className={`px-6 flex flex-row items-center justify-center gap-2 py-2 w-full bg-primary text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium ${
              skills.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            <p className="text-sm font-medium">Next</p>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FifthStep;
