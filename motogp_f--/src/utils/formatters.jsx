export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided to formatDate:", dateString);
      return "Invalid Date";
    }
    if (
      typeof dateString === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
      // Adjust for potential timezone issues if needed, or just use toLocaleDateString
      const [year, month, day] = dateString.split("-");
      // Using UTC to avoid timezone shifts if the input is meant to be date-only
      return new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
      ).toLocaleDateString();
    }
    // Default to locale string which might include time
    return date.toLocaleString();
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return String(dateString); // Return original string on error
  }
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      console.warn(
        "Invalid datetime provided to formatDateTime:",
        dateTimeString
      );
      return "Invalid Date";
    }

    // Format as date and time with 24-hour clock
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (e) {
    console.error("Error formatting datetime:", dateTimeString, e);
    return String(dateTimeString); // Return original string on error
  }
};
