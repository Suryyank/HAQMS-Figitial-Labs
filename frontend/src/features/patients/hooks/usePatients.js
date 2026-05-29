"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { fetchPatientData } from "../services/patients.services";

export function usePatient(id) {
  const router = useRouter();

  const { token } = useAuth();

  const [patient, setPatient] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");

      return;
    }

    const getPatient = async () => {
      try {
        setLoading(true);

        setError("");

        const data = await fetchPatientData(id, token);

        setPatient(data);
      } catch (error) {
        console.error("[PATIENT_FETCH_ERROR]", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getPatient();
    }
  }, [id, token, router]);

  return {
    patient,
    loading,
    error,
  };
}
