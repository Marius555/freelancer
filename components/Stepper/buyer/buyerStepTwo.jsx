"use client";

import React, { useState, useEffect } from "react";
import { RadioGroup } from "@heroui/react";
import { Card } from "@heroui/react";

const BuyerStepTwo = ({ onEmploymentTypeSelect, register, errors, watch }) => {
  const [selectedType, setSelectedType] = useState("");

  const companySizes = [
    {
      id: "just-me",
      title: "Just Me",
      description: "Working independently on projects",
      image: "/images/just-me.svg"
    },
    {
      id: "small-team",
      title: "2-10 People",
      description: "Small team or startup",
      image: "/images/small-team.svg"
    },
    {
      id: "medium-team",
      title: "11-50 People",
      description: "Growing company or agency",
      image: "/images/medium-team.svg"
    },
    {
      id: "large-team",
      title: "51-500 People",
      description: "Established business",
      image: "/images/large-team.svg"
    },
    {
      id: "enterprise",
      title: "500+ People",
      description: "Large enterprise organization",
      image: "/images/enterprise.svg"
    }
  ];

  // Initialize selectedType from form value
  useEffect(() => {
    const companySize = watch("companySize");
    if (companySize) {
      setSelectedType(companySize);
    }
  }, [watch]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    onEmploymentTypeSelect(value);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
        How Big is Your Team?
      </h1>
      <p className="text-sm text-center text-slate-400 mb-6">
        Tell us about your organization size
      </p>

      <div className="grid grid-cols-5 gap-4">
        {companySizes.map((type) => (
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
      {errors?.companySize && (
        <p className="text-danger text-sm mt-2 text-center">
          Please select your team size
        </p>
      )}
    </div>
  );
};

export default BuyerStepTwo;
