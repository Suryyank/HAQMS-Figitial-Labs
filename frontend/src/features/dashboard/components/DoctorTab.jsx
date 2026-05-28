import Link from "next/link";
import { useDoctor } from "../hooks/useDoctor";
import { CalendarDays, ArrowRight, Clock } from "lucide-react";

export default function DoctorTab({ activeTab, doctorsList, user, handleQueueCheckin }) {
  const {
    doctorAppointments,
    doctorQueue,
    selectedPatientHistory,
    setSelectedPatientHistory,
    handleUpdateQueueStatus,
    handleCompleteAppointment
  } = useDoctor(doctorsList);

  return (
    <>
      {activeTab === "appointments" && (
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5 text-teal-600" />
              Scheduled Daily Bookings List
            </h3>

            {doctorAppointments.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-sm">
                No appointments scheduled for you today.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-widest text-xxs font-bold border-b border-slate-200 dark:border-slate-800">
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Consultation Reason</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {doctorAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {new Date(app.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-3.5">
                          <button
                            onClick={() => setSelectedPatientHistory(app.patient)}
                            className="font-bold text-teal-600 hover:underline hover:text-teal-700 transition-colors"
                          >
                            {app.patient ? app.patient.name : "Unknown Patient"}
                          </button>
                          <span className="block text-xxs text-slate-400 mt-0.5">
                            Age: {app.patient?.age}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 font-semibold">
                          {app.reason || "None provided"}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase ${app.status === "COMPLETED" ? "bg-teal-500/10 text-teal-600" : app.status === "CANCELLED" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          {app.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => {
                                  const matchedDoc = doctorsList.find((d) => d.userId === user.id);
                                  if(handleQueueCheckin) {
                                    handleQueueCheckin(app.patientId, matchedDoc.id, app.id);
                                  }
                                }}
                                className="text-xxs px-2.5 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold hover:bg-teal-500 hover:text-white transition-colors"
                              >
                                Check In
                              </button>
                              <button
                                onClick={() => handleCompleteAppointment(app.id)}
                                className="text-xxs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-teal-500 hover:text-white transition-colors"
                              >
                                Complete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedPatientHistory && (
            <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                    Medical Records: {selectedPatientHistory.name}
                  </h3>
                  <p className="text-xxs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Gender: {selectedPatientHistory.gender} | Contact: {selectedPatientHistory.phoneNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatientHistory(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider">
                  Clinical Background Information
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-5 text-sm font-semibold">
                  {selectedPatientHistory.medicalHistory
                    ? String(selectedPatientHistory.medicalHistory).toUpperCase()
                    : "NO MEDICAL HISTORY RECORDED"}
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <Link
                  href={`/patients/${selectedPatientHistory.id}/history-records`}
                  className="text-teal-600 font-extrabold hover:underline flex items-center gap-1"
                >
                  View Diagnostic Reports Details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "queue" && (
        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-teal-600" />
            Active Operations Queue Controller
          </h3>
          
          {doctorQueue.length === 0 ? (
            <p className="text-center py-6 text-slate-400 text-sm">
              No checked-in patients in queue today.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doctorQueue.map((t) => (
                <div
                  key={t.id}
                  className={`p-5 rounded-2xl border shadow-md relative overflow-hidden flex flex-col justify-between ${t.status === "CALLING" ? "border-teal-500 bg-teal-500/10" : "border-slate-200 dark:border-slate-800 bg-slate-500/5"}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                      Token #{t.tokenNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xxs font-extrabold tracking-wide uppercase ${t.status === "CALLING" ? "bg-teal-500 text-white" : t.status === "COMPLETED" ? "bg-teal-500/10 text-teal-600" : "bg-amber-500/10 text-amber-500"}`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.patient.name}
                    </h4>
                    <p className="text-xxs text-slate-400 mt-0.5">
                      Contact: {t.patient.phoneNumber}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-2">
                    {t.status === "WAITING" && (
                      <button
                        onClick={() => handleUpdateQueueStatus(t.id, "CALLING")}
                        className="flex-1 py-1.5 bg-teal-600 text-white font-bold text-xxs rounded hover:bg-teal-700 transition-colors"
                      >
                        Call Patient
                      </button>
                    )}
                    {t.status === "CALLING" && (
                      <>
                        <button
                          onClick={() => handleUpdateQueueStatus(t.id, "COMPLETED")}
                          className="flex-1 py-1.5 bg-teal-600 text-white font-bold text-xxs rounded hover:bg-teal-700 transition-colors"
                        >
                          Consulted
                        </button>
                        <button
                          onClick={() => handleUpdateQueueStatus(t.id, "SKIPPED")}
                          className="flex-1 py-1.5 bg-rose-500/10 text-rose-500 font-bold text-xxs rounded hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          Skip
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
