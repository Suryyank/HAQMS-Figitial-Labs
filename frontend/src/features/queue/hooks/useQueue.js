import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/config/api.config";
import { useAuth } from "@/context/AuthContext";

export const useQueue = () => {
  const { token } = useAuth();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchQueueData = useCallback(async () => {
    // If there's no token, we can't fetch protected queue data.
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/queue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error("Failed to retrieve active token queue.");
      }
      const data = await res.json();
      setTokens(data);
      setError("");
    } catch (err) {
      console.error("Queue poll fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQueueData();
    const intervalId = setInterval(() => {
      fetchQueueData();
      setRefreshCount((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [fetchQueueData]);

  const groupedTokens = tokens.reduce((groups, token) => {
    const docId = token.doctorId;
    if (!groups[docId]) {
      groups[docId] = {
        doctorName: token.doctor.name,
        specialization: token.doctor.specialization,
        calling: null,
        waiting: [],
      };
    }

    if (token.status === "CALLING") {
      groups[docId].calling = token;
    } else if (token.status === "WAITING") {
      groups[docId].waiting.push(token);
    }
    return groups;
  }, {});

  return { groupedTokens, loading, error, refreshCount };
};
