"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Checkbox } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import { LogoIcon } from "../../components/logoFile";
import { Eye, EyeClosed, Github, Chrome } from "lucide-react";
import { registrationResolver } from "../../resolvers/registrationResolver";
import { createUser } from "../../appwriteUtils/createUser";
import HeroSectionImage from "../../components/heroSectionImage";

import { useRouter } from "next/navigation";

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm({
    ...registrationResolver,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      policy: false,
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const onSubmit = async (data) => {
    const req = await createUser(data);
    if (req.success) {
      router.push("/auth/onboarding");
    } else {
      console.log("failed", req.message);
    }
  };

  const handlePasswordChange = async (e) => {
    const { value } = e.target;
    await trigger("password");
    if (watch("confirmPassword")) {
      await trigger("confirmPassword");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <LogoIcon size={60} />
          <p className="text-xl font-medium">Join The Experiance</p>
          <p className="text-small text-default-500">
            Create Your Account To Continue
          </p>
        </div>
        <Form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            isRequired
            label="Email Address"
            type="email"
            variant="bordered"
            errorMessage={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeClosed className="pointer-events-none text-2xl text-default-700" />
                ) : (
                  <Eye className="pointer-events-none text-2xl text-default-700" />
                )}
              </button>
            }
            label="Password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            autoComplete="new-password"
            errorMessage={errors.password?.message}
            {...register("password", {
              onChange: handlePasswordChange,
            })}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <EyeClosed className="pointer-events-none text-2xl text-default-700" />
                ) : (
                  <Eye className="pointer-events-none text-2xl text-default-700" />
                )}
              </button>
            }
            label="Confirm Password"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            errorMessage={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <div className="flex items-center mb-2 mt-2 flex-col">
            <Checkbox {...register("policy")} size="sm">
              I agree to the terms and conditions
            </Checkbox>
            {errors.policy && (
              <p className="text-danger text-tiny mt-1">
                {errors.policy.message}
              </p>
            )}
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Sign Up"}
          </Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={
              <Chrome
                className="text-default-700"
                icon="flat-color-icons:google"
                width={24}
              />
            }
            variant="bordered"
          >
            Continue with Google
          </Button>
          <Button
            startContent={
              <Github
                className="text-default-700"
                icon="fe:github"
                width={24}
              />
            }
            variant="bordered"
          >
            Continue with Github
          </Button>
        </div>
        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link href="#" size="sm">
            Login
          </Link>
        </p>
      </div>
    
    </div>
  );
}
