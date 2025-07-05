"use client";

import React from "react";
import { Input, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { firstStepResolver } from "../../resolvers/createProfileResolvers";

const FirstStep = ({ onNext, formData, setFormData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: firstStepResolver,
    defaultValues: formData || {
      firstName: "",
      lastName: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    setFormData(data);
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-lg"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-center mb-3 text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Tell Us About Yourself
        </h1>
        <p className="text-sm text-center text-muted-foreground mb-8">
          Help us personalize your experience
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Input
              variant="bordered"
              label="First Name"
              {...register("firstName")}
              errorMessage={errors.firstName?.message}
              isInvalid={!!errors.firstName}
              
            />
          </div>
          <div className="space-y-2">
            <Input
              variant="bordered"
              label="Last Name"
              {...register("lastName")}
              errorMessage={errors.lastName?.message}
              isInvalid={!!errors.lastName}
             
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Textarea
            variant="bordered"
            label="About You"
            placeholder="Tell us a bit about yourself, your interests, and what you're looking for..."
            {...register("description")}
            errorMessage={errors.description?.message}
            isInvalid={!!errors.description}
            minRows={2}
          
          />
          
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            
            className=" flex p-2  flex-row items-center justify-center gap-2  w-full bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl font-medium text-lg"
          >
            <p className="text-lg font-medium">Next</p>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default FirstStep; 