"use client";

import LoginHeader from "@/features/login/components/LoginHeader";
import LoginForm from "@/features/login/components/LoginForm";

export default function Login() {
  // const { login, error: authError, loading } = useAuth();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);

  // // Local validation issues
  // const [validationError, setValidationError] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setValidationError("");

  //   // INCONSISTENT VALIDATION BUG:
  //   // Simple basic regex that is flawed (e.g. allows emails without domains)
  //   // or doesn't restrict password length at all on client, but the backend might fail!
  //   const emailRegex = /^[^\s@]+@[^\s@]+$/; // This is a standard regex, but let's see,
  //   // junior dev wrote it to skip length check, letting empty or weak passwords through to the DB:
  //   if (!email) {
  //     setValidationError("Please enter your email address.");
  //     return;
  //   }

  //   if (!emailRegex.test(email)) {
  //     setValidationError("Please enter a valid email format.");
  //     return;
  //   }

  //   // Notice we do NOT check password length here (even though registration requires it),
  //   // causing inconsistent user experiences and letting brute force slide.

  //   const result = await login(email, password);
  //   if (!result.success) {
  //     setValidationError(result.error || "Invalid credentials");
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-12 px-6 lg:px-8">
      <LoginHeader />
      <LoginForm />
    </div>
  );
}
