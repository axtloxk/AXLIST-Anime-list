"use client";
import { toast } from "sonner";

const page = () => {
  return (
    <div className="my-auto mx-auto">
      <div
        onClick={() => {
          toast.success("good");
        }}
      >
        login
      </div>
    </div>
  );
};

export default page;
