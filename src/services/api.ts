import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("Set VITE_API_URL in the frontend .env file.");
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { error?: { message?: string } })?.error?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
