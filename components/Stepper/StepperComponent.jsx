"use client";

import React from "react";

const StepperComponent = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Role" },
    { number: 2, title: "Employment" },
    { number: 3, title: "Details" },
    { number: 4, title: "Complete" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                  currentStep >= step.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-content2 text-foreground"
                }`}
              >
                <span className="text-xs font-medium">{step.number}</span>
              </div>
              <span
                className={`text-xs mt-1 transition-all duration-300 ease-in-out ${
                  currentStep >= step.number
                    ? "text-primary font-medium"
                    : "text-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-2 transition-all duration-300 ease-in-out ${
                  currentStep > step.number
                    ? "bg-primary"
                    : "bg-content2"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepperComponent; 