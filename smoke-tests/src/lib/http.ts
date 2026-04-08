import axios from "axios";
import { config } from "../config";

export const http = axios.create({
  baseURL: config.baseUrl,
  timeout: 10_000,
  validateStatus: () => true, // Don't throw on non-2xx — let tests assert status
});
