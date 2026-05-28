"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import ReceptionistTab from "@/features/dashboard/components/ReceptionistTab";
import DoctorTab from "@/features/dashboard/components/DoctorTab";
import AdminTab from "@/features/dashboard/components/AdminTab";

export default function Dashboard() {
  const router = useRouter();
  const { activeTab, setActiveTab, doctorsList, setDoctorsList, user } = useDashboard();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        {/* Navigation Tabs based on Role */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto gap-4">
          {user.role === "ADMIN" && (
            <>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === "reports" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-400"}`}
              >
                System Audit Reports
              </button>
              <button
                onClick={() => setActiveTab("physicians")}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === "physicians" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-400"}`}
              >
                Physician Registry
              </button>
            </>
          )}

          {(user.role === "RECEPTIONIST" || user.role === "ADMIN") && (
            <>
              <button
                onClick={() => setActiveTab("patients")}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === "patients" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-400"}`}
              >
                Patient Registry Directory
              </button>
              <button
                onClick={() => setActiveTab("book")}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === "book" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-400"}`}
              >
                Scheduling / Check-in Portal
              </button>
            </>
          )}

          {user.role === "DOCTOR" && (
            <>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === "appointments" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-400"}`}
              >
                My Scheduled Bookings
              </button>
              <button
                onClick={() => setActiveTab("queue")}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === "queue" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-400"}`}
              >
                Active Calling Queue
              </button>
            </>
          )}
        </div>

        {(user.role === "RECEPTIONIST" || user.role === "ADMIN") && (
          <ReceptionistTab activeTab={activeTab} doctorsList={doctorsList} user={user} />
        )}

        {user.role === "DOCTOR" && (
          <DoctorTab activeTab={activeTab} doctorsList={doctorsList} user={user} />
        )}

        {user.role === "ADMIN" && (
          <AdminTab activeTab={activeTab} doctorsList={doctorsList} setDoctorsList={setDoctorsList} />
        )}
      </main>
    </div>
  );
}
