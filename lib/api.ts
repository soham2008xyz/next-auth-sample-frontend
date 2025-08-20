import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. https://api.example.com
  withCredentials: true,
});
