import { useReceptionist } from "../hooks/useReceptionist";
import { Search, ClipboardList, Trash2, UserPlus, CalendarDays, Activity } from "lucide-react";
import SearchInput from "./SearchInput";

export default function ReceptionistTab({ activeTab, doctorsList, user }) {
  const {
    patients, patientsLoading, patientSearch, setPatientSearch,
    patientGender, setPatientGender, patientsPagination, fetchPatients,
    regName, setRegName, regEmail, setRegEmail, regPhone, setRegPhone,
    regAge, setRegAge, regGender, setRegGender, regHistory, setRegHistory,
    regMessage, handleRegisterPatient,
    bookingPatientId, setBookingPatientId, bookingDoctorId, setBookingDoctorId,
    bookingDate, setBookingDate, bookingReason, setBookingReason,
    bookingMessage, handleBookAppointment, handleDeletePatient,
    handleQueueCheckin, checkinMessage, setCheckinMessage
  } = useReceptionist(doctorsList);

  return (
    <>
      {checkinMessage && (
        <div className="p-4 mb-6 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-between text-sm">
          <span>{checkinMessage}</span>
          <button
            onClick={() => setCheckinMessage("")}
            className="font-bold underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {activeTab === "patients" && (
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-teal-600" />
                  Patient Lookup Directory
                </h3>

                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 rounded-lg shadow-sm">
                    <SearchInput
                      value={patientSearch}
                      onChange={setPatientSearch}
                      placeholder="Search by name, phone or email..."
                    />
                  </div>

                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {patientsLoading ? (
                  <p className="text-center py-6 text-slate-400 animate-pulse text-sm">
                    Synchronizing table data...
                  </p>
                ) : patients.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 text-sm">
                    No registered patients match this filter.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                      <thead>
                        <tr className="text-slate-400 uppercase tracking-widest text-xxs font-bold border-b border-slate-200 dark:border-slate-800">
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">Age/Sex</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {patients.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                              {p.name}
                              {p.email && (
                                <span className="block text-xxs text-slate-400 font-normal mt-0.5">
                                  {p.email}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                              {p.phoneNumber}
                            </td>
                            <td className="py-3.5 text-slate-500 dark:text-slate-400">
                              {p.age} yrs / <span className="capitalize">{p.gender}</span>
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleQueueCheckin(p.id, doctorsList[0]?.id)}
                                className="text-xxs px-2.5 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold hover:bg-teal-500 hover:text-white transition-colors"
                              >
                                Check In
                              </button>

                              {user?.role === "ADMIN" && (
                                <button
                                  onClick={() => handleDeletePatient(p.id)}
                                  className="text-xxs p-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                                  title="Delete patient record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">
                    Page {patientsPagination.page} of {patientsPagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={patientsPagination.page <= 1}
                      onClick={() => fetchPatients(patientsPagination.page - 1)}
                      className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-teal-500/10 disabled:opacity-50 text-xs font-semibold"
                    >
                      Prev
                    </button>
                    <button
                      disabled={patientsPagination.page >= patientsPagination.totalPages}
                      onClick={() => fetchPatients(patientsPagination.page + 1)}
                      className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-teal-500/10 disabled:opacity-50 text-xs font-semibold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 h-fit">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                <UserPlus className="h-5 w-5 text-teal-600" />
                New Registration
              </h3>

              {regMessage && (
                <div
                  className={`p-3 text-sm rounded-lg mb-4 ${regMessage.startsWith("Success") ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20" : "bg-rose-500/15 text-rose-500 border border-rose-500/20"}`}
                >
                  {regMessage}
                </div>
              )}

              <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Patient Full Name*</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Bruce Wayne"
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Age (Years)*</label>
                    <input
                      type="number"
                      required
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      placeholder="35"
                      className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Gender*</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Contact Phone*</label>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="555-0199"
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="bruce@wayne.com"
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Medical Anamnesis / History (Can be left blank)
                  </label>
                  <textarea
                    value={regHistory}
                    onChange={(e) => setRegHistory(e.target.value)}
                    placeholder="E.g. cardiovascular risks, asthma..."
                    rows="3"
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="glow-btn w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2"
                >
                  Register Patient Record
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === "book" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5 text-teal-600" />
              Schedule Appointment Slot
            </h3>

            {bookingMessage && (
              <div
                className={`p-3 text-sm rounded-lg mb-4 ${bookingMessage.startsWith("Success") ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20" : "bg-rose-500/15 text-rose-500 border border-rose-500/20"}`}
              >
                {bookingMessage}
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1">Select Registered Patient*</label>
                <select
                  required
                  value={bookingPatientId}
                  onChange={(e) => setBookingPatientId(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phoneNumber})
                    </option>
                  ))}
                </select>
                <span className="text-xxs text-slate-400 block mt-1">
                  If client is missing, register them in the Directory tab first.
                </span>
              </div>

              <div>
                <label className="block mb-1">Select Physician*</label>
                <select
                  required
                  value={bookingDoctorId}
                  onChange={(e) => setBookingDoctorId(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                >
                  <option value="">-- Choose Physician --</option>
                  {doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} - {d.specialization} (${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Appointment Date & Time*</label>
                <input
                  type="datetime-local"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Consultation Objective / Reason</label>
                <input
                  type="text"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Regular diagnostic review, suture removal..."
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="glow-btn w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2"
              >
                Book Appointment Slot
              </button>
            </form>
          </div>

          <div className="glass p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-teal-600" />
              Active Direct Queue Check-In
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-semibold">
              Generate an immediate waiting token for a direct walk-in patient. Allocates active positions under selected practitioners.
            </p>

            <div className="space-y-6">
              <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block mb-1">Select Walk-in Patient*</label>
                  <select
                    id="walkin-patient"
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Assign Physician*</label>
                  <select
                    id="walkin-doctor"
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="">-- Choose Physician --</option>
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    const pId = document.getElementById("walkin-patient").value;
                    const dId = document.getElementById("walkin-doctor").value;
                    if (!pId || !dId) {
                      alert("Select patient and doctor first");
                      return;
                    }
                    handleQueueCheckin(pId, dId);
                  }}
                  className="glow-btn w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 font-extrabold text-sm rounded-lg shadow-md transition-colors duration-300 mt-2"
                >
                  Generate Live Token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
