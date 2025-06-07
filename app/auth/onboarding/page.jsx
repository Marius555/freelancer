"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card } from "@heroui/react";
import { useForm } from "react-hook-form";
import StepOne from "../../../components/Stepper/stepOne";
import { motion, AnimatePresence } from "framer-motion";
import FreelancerFirstStep from "../../../components/Stepper/freelancer/freelancerFirstStep";
import FreelancerSecondStep from "../../../components/Stepper/freelancer/freelancerSecondStep";
import FreelancerLastStep from "../../../components/Stepper/freelancer/freelancerLastStep";
import BuyerStepOne from "../../../components/Stepper/buyer/buyerStepOne";
import BuyerStepTwo from "../../../components/Stepper/buyer/buyerStepTwo";
import BuyerStepThree from "../../../components/Stepper/buyer/buyerStepThree";
import { freelancerOnboardingResolver } from "../../../resolvers/freelancerOnboardingResolver";
import { clientOnboardingResolver } from "../../../resolvers/clientOnboardingResolver";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger
  } = useForm({
    mode: "onChange",
    resolver: selectedRole === "freelancer" ? freelancerOnboardingResolver : clientOnboardingResolver
  });

  // Update selectedRole when role changes
  React.useEffect(() => {
    const role = watch("role");
    if (role) {
      setSelectedRole(role);
    }
  }, [watch("role")]);

  const employmentType = watch("employmentType");
  const freelanceType = watch("freelanceType");

  const handleRoleSelect = (role) => {
    // Reset all form fields when role changes
    setValue("role", role);
    setValue("employmentType", "");
    setValue("freelanceType", "");
    setValue("companySize", "");
    setValue("purpose", "");
    setSelectedRole(role);
  };

  const handleEmploymentTypeSelect = (type) => {
    setValue("employmentType", type);
  };

  const handleFreelanceTypeSelect = (type) => {
    setValue("freelanceType", type);
  };

  const handleCompanySizeSelect = (size) => {
    setValue("companySize", size);
  };

  const handlePurposeSelect = (purpose) => {
    setValue("purpose", purpose);
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      const fieldsToValidate = getFieldsToValidate(currentStep);
      const isValid = await trigger(fieldsToValidate);
      
      if (isValid) {
        // If we're on step 3 and it's a freelancer, submit the form
        if (currentStep === 3 && selectedRole === "freelancer") {
          const formData = {
            role: selectedRole,
            employmentType,
            freelanceType,
            ...watch() // Include all form data except resolver
          };
          delete formData.resolver; // Remove resolver from submission data
          await onSubmit(formData);
        }
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const getFieldsToValidate = (step) => {
    if (selectedRole === "freelancer") {
      switch (step) {
        case 1:
          return ["role"];
        case 2:
          return ["employmentType"];
        case 3:
          return ["freelanceType"];
        default:
          return [];
      }
    } else {
      // Client validation
      switch (step) {
        case 1:
          return ["role"];
        case 2:
          return ["employmentType"];
        case 3:
          return ["companySize"];
        case 4:
          return ["purpose"];
        default:
          return [];
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Remove resolver from submission data
      const submissionData = { ...data };
      delete submissionData.resolver;
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", submissionData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClientSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      const formData = {
        role: selectedRole,
        employmentType,
        companySize: watch("companySize"),
        purpose: watch("purpose"),
        ...watch() // Include all form data
      };
      delete formData.resolver; // Remove resolver from submission data
      await onSubmit(formData);
    }
  };

  const handleFreelancerSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      const formData = {
        role: selectedRole,
        employmentType,
        freelanceType,
        ...watch() // Include all form data
      };
      delete formData.resolver; // Remove resolver from submission data
      await onSubmit(formData);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !selectedRole;
    if (currentStep === 2) return !employmentType;
    if (currentStep === 3) {
      if (selectedRole === "freelancer") return !freelanceType;
      if (selectedRole === "client") return !watch("companySize");
    }
    if (currentStep === 4 && selectedRole === "client") return !watch("purpose");
    return false;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%"
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%"
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%"
    })
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full"
        initial={{ maxWidth: "42rem" }}
        animate={{
          maxWidth: currentStep === 1 ? "42rem" : "72rem"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 35,
          duration: 0.4
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="w-full p-8 transition-all duration-400 ease-out">
            <div className="mb-8 min-h-[400px] relative">
              <AnimatePresence initial={false} custom={currentStep} mode="sync">
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 35, duration: 0.4 },
                    opacity: { duration: 0.25, ease: "easeOut" }
                  }}
                >
                  {currentStep === 1 && (
                    <StepOne 
                      onRoleSelect={handleRoleSelect} 
                      register={register}
                      errors={errors}
                      watch={watch}
                    />
                  )}
                  {currentStep === 2 && selectedRole === "freelancer" && (
                    <FreelancerFirstStep 
                      onEmploymentTypeSelect={handleEmploymentTypeSelect}
                      register={register}
                      errors={errors}
                      watch={watch}
                    />
                  )}
                  {currentStep === 2 && selectedRole === "client" && (
                    <BuyerStepOne 
                      onEmploymentTypeSelect={handleEmploymentTypeSelect}
                      register={register}
                      errors={errors}
                      watch={watch}
                    />
                  )}
                  {currentStep === 3 && selectedRole === "freelancer" && (
                    <FreelancerSecondStep 
                      onEmploymentTypeSelect={handleFreelanceTypeSelect}
                      register={register}
                      errors={errors}
                      watch={watch}
                    />
                  )}
                  {currentStep === 3 && selectedRole === "client" && (
                    <BuyerStepTwo 
                      onEmploymentTypeSelect={handleCompanySizeSelect}
                      register={register}
                      errors={errors}
                      watch={watch}
                    />
                  )}
                  {currentStep === 4 && selectedRole === "client" && (
                    <BuyerStepThree 
                      onEmploymentTypeSelect={handlePurposeSelect}
                      register={register}
                      errors={errors}
                      watch={watch}
                    />
                  )}
                  {currentStep === 4 && selectedRole === "freelancer" && (
                    <FreelancerLastStep 
                      onBack={handleBack}
                      register={register}
                      errors={errors}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between mt-8">
              {currentStep < 4 && (
                <>
                  <Button
                    onPress={handleBack}
                    isDisabled={currentStep === 1}
                    color="default"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Button
                    onPress={handleNext}
                    isDisabled={isNextDisabled()}
                    color="primary"
                    size="lg"
                  >
                    {currentStep === 3 && selectedRole === "freelancer" ? "Submit" : "Next"}
                  </Button>
                </>
              )}
              {currentStep === 4 && selectedRole === "client" && (
                <>
                  <Button
                    onPress={handleBack}
                    color="default"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Button
                    onPress={handleClientSubmit}
                    isDisabled={isNextDisabled()}
                    color="primary"
                    size="lg"
                  >
                    Submit
                  </Button>
                </>
              )}
              {currentStep === 4 && selectedRole === "freelancer" && (
                <>
                  <Button
                    onPress={handleBack}
                    color="default"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Button
                    onPress={handleFreelancerSubmit}
                    isDisabled={isNextDisabled()}
                    color="primary"
                    size="lg"
                  >
                    Submit
                  </Button>
                </>
              )}
            </div>
          </Card>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
