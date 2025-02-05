import {
  API_BASE_URL,
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
} from "@utils/constant";
import { Buffer } from "buffer";

// Utility function to create a sleep promise
export const sleep = (m: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, m));

// Format a time string to a more readable format
export const formatTime = (str?: string): string => {
  if (!str) return ""; // Handle null or undefined input
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [datePart, timePart] = str.split("T");
  const arr = datePart.split("-");
  const monthIndex = parseInt(arr[1], 10) - 1; // Parse the month correctly
  return `${arr[2]} ${months[monthIndex]} ${arr[0]}, ${timePart}`;
};

// Get the initials from a name
export const getInitials = (name?: string): string => {
  if (!name) return ""; // Handle null or undefined input
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials.substring(0, 2);
};

// Generate a URL for the wallet history
export const generateURL = (
  active: string = "ALL",
  referenceNumber: string,
  pageNo: number = DEFAULT_PAGE_NO,
  pageSize: number = DEFAULT_PAGE_SIZE,
  API: string = API_BASE_URL
): string => {
  return `${API}/ocpl/wallet/${referenceNumber}/history?pageNo=${pageNo}&pageSize=${pageSize}${
    active !== "ALL" ? `&type=${active.toUpperCase()}` : ""
  }`;
};

// Active tab indicator based on active state
export const ActiveTabIndicator = (active: string): string => {
  switch (active) {
    case "TOPUP":
      return "Credit";
    case "PAID":
      return "Debit";
    default:
      return "ALL";
  }
};

// Truncate a string to a specified length
export const truncateString = (str: string, num: number): string => {
  return str.length <= num ? str : str.slice(0, num) + "...";
};

// Format a number with commas
export const formatWithCommas = (amount: number | string): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Decode roles from a JWT token
export const decodeRolesFromToken = (token?: string | null | undefined): string => {
  if (!token) return ''; // Handle null or undefined input
  try {
    const parts = token.split(".").map((part) => {
      return Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    });
    const payload = JSON.parse(parts[1].toString());
    return payload.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return '';
  }
};

// Format a string with a specific prefix and hyphen-separated format
export const formatString = (value: string): string => {
  const prefix = value.substring(0, 3);
  const digits = value.substring(3).replace(/\D/g, ""); // Keep only digits
  const part1 = digits.substring(0, 4);
  const part2 = digits.substring(4, 8);
  const part3 = digits.substring(8);
  return `${prefix}-${part1}-${part2}-${part3}`;
};


export const prettier = (prefix, data) => {
  const prettyData = JSON.stringify(data, null, 2);

  if (prefix) {
    console.log(`${prefix}:`, prettyData);
  } else {
    console.log(prettyData);
  }
};
