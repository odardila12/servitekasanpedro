"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

// Component to render the main OTP input, using forwardRef to allow the parent to get a reference to the input element
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref} // Forward the ref to the OTPInput component
    containerClassName={cn(
      // Combine provided container classes with default styles
      "flex items-center gap-2 disabled:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)} // Combine provided classes with default styles for disabled state
    {...props} // Spread the rest of the props to the OTPInput
  />
));
InputOTP.displayName = "InputOTP";

// Group wrapper component for the OTP input, allowing additional styling and layout adjustments
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

// Component to render each slot (individual character box) of the OTP input
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext); // Access the OTP input context
  const slot = inputOTPContext.slots[index]; // Get the slot data for the given index

  if (!slot) {
    // If the slot is not found, log an error and return null
    console.error(`InputOTPSlot: Invalid slot index ${index}`);
    return null;
  }

  const { char, hasFakeCaret, isActive } = slot; // Destructure the slot data

  return (
    <div
      ref={ref} // Forward the ref to the slot div
      className={cn(
        // Apply styles based on whether the slot is active
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background", // Highlight the active slot
        className
      )}
      {...props} // Spread the rest of the props to the slot div
    >
      {char} {/* Render the character in the slot */}
      {hasFakeCaret && (
        // If the slot has a fake caret, render it
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />{" "}
          {/* Blinking caret animation */}
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

// Component to render a separator between OTP input slots
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    {" "}
    {/* Render a separator with a dot icon */}
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
