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

export const formatTime = (milliseconds) => {
  try {
    if (isNaN(milliseconds)) {
      return "Invalid Time";
    }

    // For lap times
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const remainingMs = Math.floor(milliseconds % 1000);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${remainingMs
        .toString()
        .padStart(3, "0")}`;
    } else {
      return `${seconds}.${remainingMs.toString().padStart(3, "0")}`;
    }
  } catch (e) {
    console.error("Error formatting time:", milliseconds, e);
    return String(milliseconds);
  }
};

/**
 * Format a date specifically for news articles display
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date as "Month Day, Year"
 */
export const formatNewsDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date provided to formatNewsDate:", dateString);
      return "Invalid Date";
    }

    // Format consistently as "Month Day, Year" (e.g., May 14, 2025)
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting news date:", dateString, e);
    return String(dateString);
  }
};

/**
 * Get standardized article types and their corresponding colors
 */
export const ARTICLE_TYPES = {
  "Latest MotoGP™ News": "red",
  "News by GP": "green",
  "MotoGP™ Grand Prix and Test reports": "blue",
  "Latest Moto2™ & Moto3™ News": "orange",
  "Official Communications": "purple",
};

/**
 * Map of alternative spellings to standardized types
 */
export const ARTICLE_TYPE_ALIASES = {
  "latest motogp news": "Latest MotoGP™ News",
  "motogp news": "Latest MotoGP™ News",
  "news by gp": "News by GP",
  "motogp grand prix and test reports": "MotoGP™ Grand Prix and Test reports",
  "test reports": "MotoGP™ Grand Prix and Test reports",
  "grand prix reports": "MotoGP™ Grand Prix and Test reports",
  "latest moto2 & moto3 news": "Latest Moto2™ & Moto3™ News",
  "moto2 and moto3 news": "Latest Moto2™ & Moto3™ News",
  "moto2 moto3 news": "Latest Moto2™ & Moto3™ News",
  "official motogp news": "Official Communications",
  "official communications": "Official Communications",
  "official news": "Official Communications",
};

/**
 * Get the standardized article type from any input
 * @param {string} articleType - The article type from the data
 * @returns {string} Standardized article type
 */
export const getStandardArticleType = (articleType) => {
  if (!articleType) return null;

  // Normalize the input for comparison
  const normalizeForComparison = (text) => {
    return text
      .trim()
      .toUpperCase()
      .replace(/™/g, "") // Remove ™ symbol
      .replace(/&/g, "and") // Replace & with and
      .replace(/\s+/g, " "); // Normalize spaces
  };

  const normalizedInput = normalizeForComparison(articleType);

  // Check for direct match in aliases
  if (ARTICLE_TYPE_ALIASES[normalizedInput]) {
    return ARTICLE_TYPE_ALIASES[normalizedInput];
  }

  // Check if the normalized input contains or is contained by any alias key
  for (const [alias, standardType] of Object.entries(ARTICLE_TYPE_ALIASES)) {
    if (normalizedInput.includes(alias) || alias.includes(normalizedInput)) {
      return standardType;
    }
  }

  // Check the original ARTICLE_TYPES with normalized comparison
  for (const type of Object.keys(ARTICLE_TYPES)) {
    const normalizedType = normalizeForComparison(type);
    if (normalizedType === normalizedInput) {
      return type;
    }
  }

  // Check for partial matches in ARTICLE_TYPES if no exact match found
  for (const type of Object.keys(ARTICLE_TYPES)) {
    const normalizedType = normalizeForComparison(type);
    if (
      normalizedInput.includes(normalizedType) ||
      normalizedType.includes(normalizedInput)
    ) {
      return type;
    }
  }

  // If no match found, return the original string
  return articleType;
};

/**
 * Get the color for a specific article type
 * @param {string} articleType - The article type
 * @returns {string} Color code for tag display
 */
export const getArticleTypeColor = (articleType) => {
  const standardType = getStandardArticleType(articleType);
  return ARTICLE_TYPES[standardType] || "default";
};
