import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "../services/login.services";
import { useState } from "react";
import { loginSchema } from "../validations/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
export const useLogin = () => {
  const { login, error: authError, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data) => {
    try {
      setSubmitError("");
      await loginUser(login, data);
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const fillCredentials = (email, password) => {
    setValue("email", email);
    setValue("password", password);
  };

  const togglePassword = () => {
    setShowPassword((p) => !p);
  };

  return {
    register,
    handleSubmit,
    isSubmitting,
    onLoginSubmit,
    errors,

    showPassword,
    togglePassword,

    loading,
    authError,
    submitError,

    fillCredentials,
  };
};
