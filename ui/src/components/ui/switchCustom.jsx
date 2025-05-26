import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export function SwitchCustom({ checked, onCheckedChange }) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="bg-gray-300 w-10 h-6 rounded-full relative transition-colors data-[state=checked]:bg-green-500"
    >
      <SwitchPrimitive.Thumb
        className="block size-4 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-5"
      />
    </SwitchPrimitive.Root>
  );
}
