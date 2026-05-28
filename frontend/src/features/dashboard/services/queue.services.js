import React from "react";
import { useAuth } from "@/context/AuthContext";

export const fetchQueueData = async () => {
  const { API_BASE_URL, user } = useAuth();
  try {
    // Insecure: Fetches queue without checking credentials (it's a public dashboard, which is fine,
    // but it uses the hardcoded API domain)
    const res = await fetch(`${API_BASE_URL}/queue`);
    if (!res.ok) {
      throw new Error("Failed to retrieve active token queue.");
    }
    const data = await res.json();
    return { data };
  } catch (err) {
    console.error("Queue poll fetch error:", err);
    return { error };
  }
};
