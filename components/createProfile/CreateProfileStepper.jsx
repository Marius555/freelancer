"use client";

import React, { useState } from "react";
import { Card } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import FirstStep from "./FirstStep";
import SecondStep from "../createProfile/SecondStep";
import ThirdStep from "../createProfile/ThirdStep";
import FourthStep from "../createProfile/FourthStep";
import FifthStep from "../createProfile/FifthStep";
import SixStep from "../createProfile/SixStep";


const CreateProfileStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    {
      title: "Basic Info",
    },
    {
      title: "Profile Picture",
    },
    {
      title: "Languages",
    },
    {
      title: "Occupation & Skills",
    },
    {
      title: "Skills",
    },
    {
      title: "Review",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%",
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full"
        initial={{ maxWidth: "42rem" }}
        animate={{
          maxWidth: currentStep === 0 ? "42rem" : "72rem",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 35,
          duration: 0.4,
        }}
      >
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
                  opacity: { duration: 0.25, ease: "easeOut" },
                }}
              >
                {currentStep === 0 && (
                  <SixStep
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                {/* {currentStep === 1 && (
                  <SecondStep
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 2 && (
                  <ThirdStep
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 3 && (
                  <FourthStep
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 4 && (
                  <FifthStep
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                {currentStep === 5 && (
                  <SixStep
                    onNext={handleNext}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )} */}
                {/* Add other steps here as they are created */}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateProfileStepper; 