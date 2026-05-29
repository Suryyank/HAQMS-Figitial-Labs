"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api.config";
import Navbar from "@/components/common/Navbar";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clipboard,
  Activity,
  Calendar,
  User,
  Mail,
  Phone,
  Heart,
} from "lucide-react";
import PatientsBackButton from "@/features/patients/components/PatientsBackButton";

export default function PatientHistoryRecords() {
  const { token } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchPatientData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to retrieve patient diagnostic records.");
        }
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("History record fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, token]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8">
        {/* Back Link */}
        <PatientsBackButton />

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="pulse-loader">
              <div></div>
              <div></div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-400">
              Loading historical clinical records...
            </p>
          </div>
        ) : error ? (
          <div className="glass p-8 text-center rounded-2xl border border-rose-500/25 bg-rose-500/5 text-rose-500 max-w-xl mx-auto shadow-lg">
            <h3 className="text-lg font-bold">Failed to Load Records</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {error ||
                "Make sure the patient ID is valid and the backend API is online."}
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Header profile card */}
            <div className="glass p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl shadow-inner border border-teal-500/20">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                      {patient.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 text-xxs font-extrabold tracking-wide uppercase">
                      Patient File Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Verified ID: {patient.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:flex gap-4 md:gap-8 text-xs font-semibold text-slate-500">
                <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  <span className="block text-slate-400 text-xxs uppercase tracking-wider">
                    Age / Gender
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {patient.age} yrs /{" "}
                    <span className="capitalize">{patient.gender}</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  <span className="block text-slate-400 text-xxs uppercase tracking-wider">
                    Registered Since
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {new Date(patient.createdAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Main content split grid */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Contact Details Card */}
              <div className="space-y-6">
                <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Contact Credentials
                  </h3>
                  <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-teal-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-xxs uppercase">
                          Telephone
                        </span>
                        <span className="text-sm text-slate-800 dark:text-slate-200">
                          {patient.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-teal-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-xxs uppercase">
                          Email Address
                        </span>
                        <span className="text-sm text-slate-800 dark:text-slate-200">
                          {patient.email || "None registered"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-rose-500/10 dark:border-rose-500/5 bg-rose-500/5 dark:bg-rose-500/5 shadow-md">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        Patient Health Notice
                      </h4>
                      <p className="text-xxs text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-4">
                        All clinical diagnostics, diagnostic reports, and
                        medical logs rendered here are treated as highly
                        confidential. Unauthorized duplication violates HIPAA
                        compliance rules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anamnesis / History Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clipboard className="h-4 w-4 text-teal-600" />
                    Clinical Background Anamnesis
                  </h3>
                  <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800 text-sm leading-6">
                    {patient.medicalHistory ? (
                      <p className="text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wide">
                        {String(patient.medicalHistory).toUpperCase()}
                      </p>
                    ) : (
                      <p className="text-slate-400 italic font-semibold">
                        NO MEDICAL BACKGROUND INFORMATION RECORDED FOR THIS
                        PATIENT.
                      </p>
                    )}
                  </div>
                </div>

                {/* Consultation Appointment Logs */}
                <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-teal-600" />
                    Consultation History Logs
                  </h3>

                  {!patient.appointments ||
                  patient.appointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs italic font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No medical check-ins or completed appointments found on
                      record.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patient.appointments.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800/80 flex justify-between items-start"
                        >
                          <div className="space-y-1.5">
                            <span className="inline-flex px-2 py-0.5 rounded text-xxs font-extrabold uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 tracking-wide">
                              {app.status}
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                              Objective: {app.reason || "Routine consultation"}
                            </h4>
                            <p className="text-xxs text-slate-400 font-semibold flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(app.appointmentDate).toLocaleString(
                                [],
                                { dateStyle: "medium", timeStyle: "short" },
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xxs font-mono text-slate-400 block">
                              Record ID
                            </span>
                            <span className="text-xxs font-mono text-slate-500 dark:text-slate-400 font-bold block">
                              {app.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
