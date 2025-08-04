"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import {Input} from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { LogoIcon } from "../../components/logoFile";
import { Eye, EyeClosed, Github, Chrome } from "lucide-react";
import { loginResolver } from "../../resolvers/loginResolver";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { LoginUser } from "../../appwriteUtils/loginUser";
export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    ...loginResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (data) => {
    const response = await LoginUser(data);
    if (response.success) {
      console.log("Login successful");
    } else {
      console.log(response.message);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* <DotLottieReact
        src="/animations/new.lottie"
        loop
        autoplay
        style={{ width: '500px', height: '500px' }}
      /> */}

      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <LogoIcon size={60} />
          <p className="text-xl font-medium">Welcome Back</p>
          <p className="text-small text-default-500">Sign in to your account</p>
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
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button
            className="w-full"
            color="primary"
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Login"}
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
          Don't have an account?&nbsp;
          <Link href="/registration" size="sm">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
