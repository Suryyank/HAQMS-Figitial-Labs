import React from "react";
import Link from "next/link";
import { Activity } from "react";
const LoginHeader = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-extrabold text-3xl"
      >
        <Activity className="h-8 w-8 animate-pulse" />
        HAQMS
      </Link>
      <h2 className="mt-6 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Or use one of the pre-seeded credentials in the README
      </p>
    </div>
  );
};

export default LoginHeader;
