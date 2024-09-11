import { Spinner } from "@phosphor-icons/react";
import React from "react";

export const Load = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="animate-spin" size={32} />
    </div>
  );
};