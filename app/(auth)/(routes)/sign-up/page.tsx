import React from "react";
import RegistrationForm from "./_components/register-form";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-[96%] md:max-w-5xl mx-auto px-6 py-4">
      <RegistrationForm />
    </div>
  );
};

export default page;
