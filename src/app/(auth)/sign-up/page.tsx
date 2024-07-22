import SignInForm from "@/components/signin-form";
import Image from "next/image";
import React from "react";

const SignInPage = () => {
  return (
    <div className="h-dvh grid grid-cols-1 md:grid-cols-2">
      <div className="hidden h-full md:flex flex-col gap-1 dark:bg-zinc-900 bg-zinc-300 p-10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Com8 AI</h1>
        </div>
        <h2 className="text-sm">The ultimate AI Chat app</h2>
      </div>
      <div className="h-full flex justify-center items-center border">
        <div className="max-w-full lg:max-w-[400px] w-full p-8">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
