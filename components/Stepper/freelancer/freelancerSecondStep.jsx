"use client";

import React, { useState, useEffect } from "react";
import { RadioGroup } from "@heroui/react";
import { Card } from "@heroui/react";

const FreelancerSecondStep = ({ onEmploymentTypeSelect, register, errors, watch }) => {
  const [selectedType, setSelectedType] = useState("");

  const employmentTypes = [
    {
      id: "getting-started",
      title: "Just Getting Started",
      description: "New to freelancing and exploring opportunities",
      image: "/images/getting-started.svg"
    },
    {
      id: "online",
      title: "Online Freelance",
      description: "Working remotely on digital projects",
      image: "/images/online-freelance.svg"
    },
    {
      id: "offline",
      title: "Offline Freelance",
      description: "Working on-site with local clients",
      image: "/images/offline-freelance.svg"
    },
    {
      id: "hybrid",
      title: "Online & Offline",
      description: "Combining both remote and on-site work",
      image: "/images/hybrid-freelance.svg"
    }
  ];

  // Initialize selectedType from form value
  useEffect(() => {
    const freelanceType = watch("freelanceType");
    if (freelanceType) {
      setSelectedType(freelanceType);
    }
  }, [watch]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    onEmploymentTypeSelect(value);
  };

  // Register the field with react-hook-form
  useEffect(() => {
    if (register) {
      register("freelanceType", { required: true });
    }
  }, [register]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
        What Kind of Freelance Do You Do?
      </h1>
      <p className="text-sm text-center text-slate-400 mb-6">
        Tell us about your freelance work style and experience
      </p>

      <div className="grid grid-cols-4 gap-4">
        {employmentTypes.map((type) => (
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
      {errors?.freelanceType && (
        <p className="text-danger text-sm mt-2 text-center">
          Please select a freelance type
        </p>
      )}
    </div>
  );
};

export default FreelancerSecondStep; 