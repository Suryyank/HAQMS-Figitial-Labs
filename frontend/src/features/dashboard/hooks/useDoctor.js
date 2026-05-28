import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api.config";

export function useDoctor(doctorsList) {
  const { user, token } = useAuth();
  
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorQueue, setDoctorQueue] = useState([]);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);

  const fetchDoctorWorklist = async () => {
    if (user?.role !== "DOCTOR") return;
    try {
      const matchedDoc = doctorsList.find((d) => d.userId === user.id);
      if (!matchedDoc) return;

      const appRes = await fetch(
        `${API_BASE_URL}/appointments?doctorId=${matchedDoc.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const appData = await appRes.json();
      if (appData.success) {
        setDoctorAppointments(appData.appointments);
      }

      const queueRes = await fetch(
        `${API_BASE_URL}/queue?doctorId=${matchedDoc.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const queueData = await queueRes.json();
      setDoctorQueue(queueData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user?.role === "DOCTOR" && doctorsList.length > 0) {
      fetchDoctorWorklist();
    }
  }, [doctorsList, user]);

  const handleUpdateQueueStatus = async (tokenId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/queue/${tokenId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDoctorWorklist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteAppointment = async (appId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${appId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (res.ok) {
        fetchDoctorWorklist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    doctorAppointments,
    doctorQueue,
    selectedPatientHistory,
    setSelectedPatientHistory,
    handleUpdateQueueStatus,
    handleCompleteAppointment,
    fetchDoctorWorklist
  };
}
