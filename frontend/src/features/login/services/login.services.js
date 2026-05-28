// export const onSubmit = async (data) => {
//   try {
//     console.log(data);

//     // your auth logic here
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const handleSubmit = async (e) => {
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

export async function loginUser(loginFn, credentials) {
  try {
    const result = await loginFn(credentials.email, credentials.password);
    return result;
  } catch (error) {
    throw new Error(result.error || "Invalid credentials");
  }
}
