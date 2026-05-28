import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api.config";

export function useAdmin(setDoctorsList) {
  const { token } = useAuth();

  const [adminReportData, setAdminReportData] = useState(null);
  const [adminReportLoading, setAdminReportLoading] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  const generateSystemReport = async () => {
    setAdminReportLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reports/doctor-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAdminReportData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminReportLoading(false);
    }
  };

  const searchPhysiciansAdmin = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/doctors?search=${adminSearchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setDoctorsList(data);
      } else {
        alert(`API Error: ${data.sqlMessage || data.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    adminReportData,
    adminReportLoading,
    adminSearchQuery,
    setAdminSearchQuery,
    generateSystemReport,
    searchPhysiciansAdmin
  };
}
