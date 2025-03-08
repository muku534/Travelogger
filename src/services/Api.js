import axios from "axios";
import { API_BASE_URL } from "@env";

console.log("API_BASE_URL", API_BASE_URL)
// Create Axios instance with default headers
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
    },
});

export default api;
