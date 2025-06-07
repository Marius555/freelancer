"use client";

import React from "react";
import { Card } from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, Users, Briefcase, Zap, Rocket, ArrowLeft } from "lucide-react";

const FreelancerLastStep = ({ onBack }) => {
  const router = useRouter();

  const handleCompleteProfile = () => {
    // router.push("/profile/freelancer");
  };

  const handleStartFreelancing = () => {
    // router.push("/dashboard");
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
        You're All Set! 🎉
      </h1>
      <p className="text-sm text-center text-slate-400 mb-6">
        Let's get you started on your freelancing journey
      </p>

      <div className="w-full max-w-4xl mx-auto h-[calc(100vh-16rem)]">
        <Card className="h-full bg-gradient-to-br from-content2 to-content3 p-6">
          <div className="flex h-full">
            {/* Left side - Animation and Title */}
            <div className="w-1/2 flex flex-col justify-center items-center pr-6 border-r border-divider">
              <div className="w-48 h-48 mb-6">
                <DotLottieReact
                  src="/animations/new.lottie"
                  loop
                  style={{ width: "100%", height: "100%" }}
                  autoplay
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome Aboard! 🚀
                </h1>
                <p className="text-sm text-slate-400">
                  Your freelancer journey begins here
                </p>
              </div>
            </div>

            {/* Right side - Features and CTA */}
            <div className="w-1/2 pl-6 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Stand Out</h3>
                      <p className="text-xs text-slate-400">Showcase your unique skills</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Connect</h3>
                      <p className="text-xs text-slate-400">Build your client network</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Grow</h3>
                      <p className="text-xs text-slate-400">Land more projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Thrive</h3>
                      <p className="text-xs text-slate-400">Access premium features</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    size="lg"
                    color="primary"
                    onClick={handleCompleteProfile}
                    className="w-full"
                    endContent={<ArrowRight className="w-4 h-4" />}
                  >
                    Complete Your Profile
                  </Button>
                  <Button
                    size="lg"
                    color="secondary"
                    onClick={handleStartFreelancing}
                    className="w-full"
                    endContent={<Rocket className="w-4 h-4" />}
                  >
                    Start Freelancing
                  </Button>
                  
                  <p className="text-xs text-center text-slate-400">
                    Takes only 5 minutes to complete your profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerLastStep;
