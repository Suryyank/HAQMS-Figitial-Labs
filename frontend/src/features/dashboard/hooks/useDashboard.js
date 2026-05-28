import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api.config";

export function useDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState(
    user?.role === "ADMIN"
      ? "reports"
      : user?.role === "RECEPTIONIST"
        ? "patients"
        : "appointments"
  );
  
  const [doctorsList, setDoctorsList] = useState([]);

  const fetchDoctorsDropdown = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDoctorsList(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDoctorsDropdown();
    }
  }, [token]);

  return { activeTab, setActiveTab, doctorsList, setDoctorsList, user };
}
