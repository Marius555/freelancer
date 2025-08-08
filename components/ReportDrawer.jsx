"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  RadioGroup,
  Radio,
  Textarea,
  Divider,
  Avatar,
  Chip
} from "@heroui/react";
import { 
  Flag, 
  AlertTriangle, 
  Mail, 
  Shield, 
  UserX, 
  User, 
  Copyright, 
  MoreHorizontal 
} from "lucide-react";
import { reportResolver } from "../resolvers/reportResolver";
import reportCreator from "../appwriteUtils/reportCreator";


const ReportDrawer = ({ isOpen, onClose, creator }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    ...reportResolver,
    defaultValues: {
      reason: "",
      additionalDetails: ""
    }
  });

  // Watch form values to check if form is ready to submit
  const [reason, additionalDetails] = watch(['reason', 'additionalDetails']);
  const isFormValid = Boolean(reason && additionalDetails && additionalDetails.trim().length >= 10);

  // Debug logging (remove in production)
  console.log('Reason:', reason);
  console.log('Additional Details:', additionalDetails);
  console.log('Form valid:', isFormValid);
  console.log('Errors:', errors);

  const reportReasons = [
    {
      value: "spam",
      label: "Spam or misleading content",
      description: "Repetitive or deceptive content",
      icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      value: "inappropriate",
      label: "Inappropriate content",
      description: "Violates community guidelines",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      value: "harassment",
      label: "Harassment or bullying",
      description: "Harmful behavior towards individuals",
      icon: <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      value: "fake_profile",
      label: "Fake or impersonated profile",
      description: "Fake account or impersonation",
      icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      value: "copyright",
      label: "Copyright infringement",
      description: "Unauthorized use of protected content",
      icon: <Copyright className="w-4 h-4 sm:w-5 sm:h-5" />
    },
    {
      value: "other",
      label: "Other",
      description: "Something else not listed above",
      icon: <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  ];

  const onSubmit = async (data) => {
    try {
      // TODO: Implement actual report submission
      const reportData = {
        creatorId: creator?.id,
        reason: data.reason,
        details: data.additionalDetails,
        reportedAt: new Date()
      };

      const response = await reportCreator(reportData);
      console.log(response);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close drawer
      reset();
      onClose();
      
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      size="md"
      classNames={{
        base: "data-[placement=right]:sm:m-2 data-[placement=right]:sm:mx-2 data-[placement=right]:sm:rounded-large w-full sm:w-auto max-w-[100vw] sm:max-w-md",
        header: "border-b border-default-200",
        body: "py-4 sm:py-6",
        footer: "border-t border-default-200"
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 bg-default-100 rounded-full">
            <Flag className="w-4 sm:w-5 h-4 sm:h-5 text-foreground" />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Report Creator</h2>
            <p className="text-xs sm:text-sm text-default-500">Help us maintain a safe community</p>
          </div>
        </DrawerHeader>

        <DrawerBody className="px-4 sm:px-6">
          {creator && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-default-50 rounded-large">
                <Avatar
                  src={creator.avatar}
                  alt={creator.name}
                  size="sm"
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-foreground truncate">{creator.name}</h3>
                  {creator.username && (
                    <p className="text-xs sm:text-sm text-default-500">@{creator.username}</p>
                  )}
                  {creator.category && (
                    <Chip
                      variant="flat"
                      size="sm"
                      className="mt-1 bg-default-100 text-default-700 text-xs"
                    >
                      {creator.category}
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-3">
                Why are you reporting this creator?
              </h3>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    isInvalid={!!errors.reason}
                    errorMessage={errors.reason?.message}
                    classNames={{
                      wrapper: "gap-3"
                    }}
                  >
                    {reportReasons.map((reason) => (
                      <Radio
                        key={reason.value}
                        value={reason.value}
                        classNames={{
                          base: "inline-flex m-0 bg-content1 hover:bg-content2 items-start justify-start flex-row max-w-full cursor-pointer rounded-lg p-3 sm:p-4 border-2 border-default-200 data-[selected=true]:border-foreground",
                          wrapper: "hidden"
                        }}
                      >
                        <div className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4 w-full items-start">
                          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-default-100 rounded-full flex-shrink-0">
                            {reason.icon}
                          </div>
                          <div className="flex flex-col gap-1 text-left min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-foreground">
                              {reason.label}
                            </div>
                            <div className="text-xs text-default-500 leading-relaxed">
                              {reason.description}
                            </div>
                          </div>
                        </div>
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            <Divider />

            <div>
              <h3 className="text-base sm:text-lg font-medium text-foreground mb-3">
                Additional Details
              </h3>
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Please provide additional context that would help us understand the issue..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    maxRows={3}
                    minRows={2}
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.additionalDetails}
                    errorMessage={errors.additionalDetails?.message}
                    classNames={{
                      input: "resize-none text-sm",
                      inputWrapper: "border-2 border-default-300 hover:border-foreground focus-within:border-foreground bg-default-50"
                    }}
                  />
                )}
              />
            </div>

            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-warning-50 rounded-large border border-warning-200">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-warning-800">
                <p className="font-medium mb-1">Important</p>
                <p>
                  Please only report content that genuinely violates our community guidelines. 
                  False reports may result in restrictions on your account.
                </p>
              </div>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="flex gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <Button
            variant="bordered"
            onPress={handleClose}
            className="flex-1 border-default-300 text-default-700 hover:bg-default-100 text-sm h-9 sm:h-10"
            isDisabled={isSubmitting}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onPress={handleSubmit(onSubmit)}
            className="flex-1 bg-foreground text-background hover:bg-default-800 text-sm h-9 sm:h-10"
            isDisabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            size="sm"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReportDrawer;