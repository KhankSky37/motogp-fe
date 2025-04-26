export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided to formatDate:", dateString);
      return 'Invalid Date';
    }
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // Adjust for potential timezone issues if needed, or just use toLocaleDateString
      const [year, month, day] = dateString.split('-');
      // Using UTC to avoid timezone shifts if the input is meant to be date-only
      return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toLocaleDateString();
    }
    // Default to locale string which might include time
    return date.toLocaleString();
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return String(dateString); // Return original string on error
  }
};