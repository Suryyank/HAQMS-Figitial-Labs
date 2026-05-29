const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchQueueData = async (token) => {
  try {
    // Authentication validation
    if (!token) {
      throw new Error("Unauthorized access");
    }

    const response = await fetch(`${API_BASE_URL}/queue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to retrieve active token queue.");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[QUEUE_FETCH_ERROR]", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
