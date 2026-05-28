"use client";

import { Eye, EyeOff, Lock, User } from "lucide-react";

import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    onLoginSubmit,
    errors,

    loading,
    authError,
    submitError,

    showPassword,
    togglePassword,

    fillCredentials,
  } = useLogin();

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="glass py-8 px-6 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800">
        <form className="space-y-6" onSubmit={handleSubmit(onLoginSubmit)}>
          {(submitError || authError) && (
            <div className="p-3 text-sm bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
              {submitError || authError}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>

            <div className="mt-1 relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-5 w-5" />
              </div>

              <input
                id="email"
                type="email"
                placeholder="admin@haqms.com"
                {...register("email")}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm ${
                  errors.email
                    ? "border-rose-500"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>

            <div className="mt-1 relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`block w-full pl-10 pr-10 py-2 border rounded-lg bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm ${
                  errors.password
                    ? "border-rose-500"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="glow-btn w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* SEEDED USERS */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Seeded Demo Credentials
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials("admin@haqms.com", "password123")}
              className="text-left p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-slate-600 dark:text-slate-300"
            >
              <strong>Admin:</strong> admin@haqms.com
            </button>

            <button
              type="button"
              onClick={() =>
                fillCredentials("reception1@haqms.com", "password123")
              }
              className="text-left p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-slate-600 dark:text-slate-300"
            >
              <strong>Receptionist:</strong> reception1@haqms.com
            </button>

            <button
              type="button"
              onClick={() =>
                fillCredentials("doctor1@haqms.com", "password123")
              }
              className="text-left p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-slate-600 dark:text-slate-300"
            >
              <strong>Doctor:</strong> doctor1@haqms.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
