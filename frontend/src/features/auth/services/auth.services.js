const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function loginService(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Authentication failed");
  }

  return {
    token: data.data.token,
    user: data.data.user,
  };
}

export async function registerService(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}
