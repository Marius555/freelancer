"use client";

import React from "react";
import {Button} from "@heroui/button";
import {Input} from "@heroui/input";
import {Checkbox} from "@heroui/checkbox";
import {Link} from "@heroui/link";
import {Eye, EyeOff} from "lucide-react";

export function RegistrationForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  return (
    <div className="flex flex-col gap-4">
      <p className="pb-4 text-left text-3xl font-semibold">
        Sign Up
        <span aria-label="emoji" className="ml-2" role="img">
          👋
        </span>
      </p>
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          isRequired
          label="Username"
          labelPlacement="outside"
          name="username"
          placeholder="Enter your username"
          type="text"
          variant="bordered"
        />
        <Input
          isRequired
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeOff
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-closed-linear"
                />
              ) : (
                <Eye
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-bold"
                />
              )}
            </button>
          }
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          variant="bordered"
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleConfirmVisibility}>
              {isConfirmVisible ? (
                <EyeOff
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-closed-linear"
                />
              ) : (
                <Eye
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-bold"
                />
              )}
            </button>
          }
          label="Confirm Password"
          labelPlacement="outside"
          name="confirmPassword"
          placeholder="Confirm your password"
          type={isConfirmVisible ? "text" : "password"}
          variant="bordered"
        />
        <Checkbox isRequired className="py-4" size="sm">
          I agree with the&nbsp;
          <Link className="relative z-[1]" href="#" size="sm">
            Terms
          </Link>
          &nbsp; and&nbsp;
          <Link className="relative z-[1]" href="#" size="sm">
            Privacy Policy
          </Link>
        </Checkbox>
        <Button color="primary" type="submit">
          Sign Up
        </Button>
      </form>
      <p className="text-center text-small">
        <Link href="#" size="sm">
          Already have an account? Log In
        </Link>
      </p>
    </div>
  );
} 