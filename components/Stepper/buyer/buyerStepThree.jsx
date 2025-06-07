"use client";

import React, { useState, useEffect } from "react";
import { RadioGroup } from "@heroui/react";
import { Card } from "@heroui/react";

const BuyerStepThree = ({ onEmploymentTypeSelect, register, errors, watch }) => {
  const [selectedType, setSelectedType] = useState("");

  const purposeTypes = [
    {
      id: "starting-project",
      title: "Starting a Project",
      description: "I have a specific project in mind and need freelancers to help",
      image: "/images/starting-project.svg"
    },
    {
      id: "specific-service",
      title: "Specific Service",
      description: "I need a particular service or skill set for my business",
      image: "/images/specific-service.svg"
    },
    {
      id: "just-looking",
      title: "Just Looking",
      description: "Exploring the platform and available freelancers",
      image: "/images/just-looking.svg"
    }
  ];

  // Initialize selectedType from form value
  useEffect(() => {
    const purpose = watch("purpose");
    if (purpose) {
      setSelectedType(purpose);
    }
  }, [watch]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    onEmploymentTypeSelect(value);
  };

  // Register the field with react-hook-form
  useEffect(() => {
    if (register) {
      register("purpose", { required: true });
    }
  }, [register]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
        What Are You Looking For?
      </h1>
      <p className="text-sm text-center text-slate-400 mb-6">
        Tell us about your hiring needs
      </p>

      <div className="grid grid-cols-3 gap-4">
        {purposeTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleTypeChange(type.id)}
            className="w-full"
          >
            <Card
              className={`relative w-full h-[280px] p-5 cursor-pointer transition-all ${
                selectedType === type.id
                  ? "border-primary bg-content2"
                  : "border-default hover:border-primary bg-content2"
              }`}
            >
              <div className="absolute top-4 right-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedType === type.id
                    ? "border-primary"
                    : "border-default"
                }`}>
                  {selectedType === type.id && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center text-center h-full justify-between pt-8 pb-4">
                <div className="w-24 h-24 bg-content3 rounded-lg flex items-center justify-center">
                  {/* Placeholder for image */}
                  <div className="text-foreground text-sm">Image</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {type.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {type.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      {errors?.purpose && (
        <p className="text-danger text-sm mt-2 text-center">
          Please select your purpose
        </p>
      )}
    </div>
  );
};

export default BuyerStepThree;
