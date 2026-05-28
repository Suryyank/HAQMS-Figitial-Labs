import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api.config";

export function useReceptionist(doctorsList) {
  const { user, token } = useAuth();
  
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [patientGender, setPatientGender] = useState("All");
  const [patientsPagination, setPatientsPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(patientSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState("Male");
  const [regHistory, setRegHistory] = useState("");
  const [regMessage, setRegMessage] = useState("");

  const [bookingPatientId, setBookingPatientId] = useState("");
  const [bookingDoctorId, setBookingDoctorId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [checkinMessage, setCheckinMessage] = useState("");

  const fetchPatients = async (page = 1) => {
    setPatientsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/patients?page=${page}&limit=5&search=${debouncedSearch}&gender=${patientGender}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients);
        setPatientsPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          totalPatients: data.pagination.totalPatients,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "RECEPTIONIST" || user?.role === "ADMIN") {
      fetchPatients(1);
    }
  }, [debouncedSearch, patientGender, user]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setRegMessage("");

    // Added client-side phone number validation
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;

    if (!regName || !regPhone || !regAge) {
      setRegMessage("Error: Name, Age and Phone number are required.");
      return;
    }

    if (!phoneRegex.test(regPhone)) {
      setRegMessage("Error: Invalid phone number format.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phoneNumber: regPhone,
          age: parseInt(regAge),
          gender: regGender,
          medicalHistory: regHistory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRegMessage("Success: Patient registered successfully!");
        setRegName("");
        setRegEmail("");
        setRegPhone("");
        setRegAge("");
        setRegHistory("");
        fetchPatients(1);
      } else {
        setRegMessage(`Error: ${data.error || "Failed to register"}`);
      }
    } catch (err) {
      setRegMessage(`Error: ${err.message}`);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingMessage("");

    if (!bookingPatientId || !bookingDoctorId || !bookingDate) {
      setBookingMessage("Error: All booking fields are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: bookingPatientId,
          doctorId: bookingDoctorId,
          appointmentDate: bookingDate,
          reason: bookingReason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingMessage("Success: Appointment booked successfully!");
        setBookingReason("");
      } else {
        setBookingMessage(`Error: ${data.error || "Failed to book"}`);
      }
    } catch (err) {
      setBookingMessage(`Error: ${err.message}`);
    }
  };

  const handleDeletePatient = async (id) => {
    // Security check on frontend: only ADMIN can delete
    if (user.role !== "ADMIN") {
      alert("Error: Only administrators can delete patient records.");
      return;
    }

    if (!confirm("Are you sure you want to delete this patient record?"))
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Patient deleted.");
        fetchPatients(patientsPagination.page);
      } else {
        alert(`Error: ${data.error || "Unauthorized deletion!"}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleQueueCheckin = async (
    patientId,
    doctorId,
    appointmentId = null,
  ) => {
    setCheckinMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/queue/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patientId, doctorId, appointmentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCheckinMessage(
          `Checked in! Generated Token #${data.token.tokenNumber}`,
        );
      } else {
        setCheckinMessage(`Error check-in: ${data.error}`);
      }
    } catch (err) {
      setCheckinMessage(`Error: ${err.message}`);
    }
  };

  return {
    patients,
    patientsLoading,
    patientSearch,
    setPatientSearch,
    patientGender,
    setPatientGender,
    patientsPagination,
    fetchPatients,
    regName, setRegName,
    regEmail, setRegEmail,
    regPhone, setRegPhone,
    regAge, setRegAge,
    regGender, setRegGender,
    regHistory, setRegHistory,
    regMessage,
    handleRegisterPatient,
    bookingPatientId, setBookingPatientId,
    bookingDoctorId, setBookingDoctorId,
    bookingDate, setBookingDate,
    bookingReason, setBookingReason,
    bookingMessage,
    handleBookAppointment,
    handleDeletePatient,
    handleQueueCheckin,
    checkinMessage,
    setCheckinMessage
  };
}
