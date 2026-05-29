export const fetchPatientData = async (id, token) => {
  if (!token) {
    throw new Error("Unauthorised");
  }
  const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const patientData = await res.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to retrieve patient records.");
  }
  return patientData;
};
