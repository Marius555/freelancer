"use client";

import React, { useState, useEffect } from "react";
import { RadioGroup, Radio } from "@heroui/react";
import { Card } from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const StepOne = ({ onRoleSelect, register, errors, watch }) => {
  const [selectedRole, setSelectedRole] = useState("");

  // Initialize selectedRole from form value
  useEffect(() => {
    const role = watch("role");
    if (role) {
      setSelectedRole(role);
    }
  }, [watch]);

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    onRoleSelect(value);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
        Choose Your Role
      </h1>
      <p className="text-sm text-center text-slate-400 mb-6">
        Select whether you want to offer services or hire freelancers
      </p>

      <RadioGroup
        value={selectedRole}
        onValueChange={handleRoleChange}
        className="space-y-3"
      >
        <div onClick={() => handleRoleChange("freelancer")}>
          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedRole === "freelancer"
                ? "border-primary bg-content2"
                : "border-default hover:border-primary bg-content2"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <DotLottieReact
                  src="/animations/freelancer.lottie"
                  loop
                  style={{ width: "100px", height: "100px" }}
                  autoplay
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <Radio value="freelancer">
                    <label className="ml-2 text-lg font-semibold text-foreground">
                      I'm a Freelancer
                    </label>
                  </Radio>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Looking for projects and opportunities to showcase your skills
                  and expertise.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div onClick={() => handleRoleChange("client")}>
          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedRole === "client"
                ? "border-primary bg-content2"
                : "border-default hover:border-primary bg-content2"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <DotLottieReact
                  src="/animations/client.lottie"
                  loop
                  style={{ width: "100px", height: "100px" }}
                  autoplay
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <Radio value="client">
                    <label className="ml-2 text-lg font-semibold text-foreground">
                      I'm a Client
                    </label>
                  </Radio>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Looking to hire talented professionals for your projects and
                  business needs.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StepOne; 