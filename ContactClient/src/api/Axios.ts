// Axios.ts
import axios from "axios";
import {UAParser} from "ua-parser-js";

class Axios {
  // Public instance without client headers by default
  axiosInstance = axios.create({
    baseURL: "http://localhost:8569/api/v1/",
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  // Secure instance without client headers by default
  axiosInstanceSecure = axios.create({
    baseURL: "http://localhost:8569/secure/",
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  // Helper to generate client headers with real IP and location
  public async getClientHeaders() {
    // Get client IP using a free API service
    let clientIp = "unknown";
    let clientLocation = "unknown";
    
    try {
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      clientIp = ipResponse.data.ip;
      
      // Get location using IP-based geolocation
      const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
      clientLocation = [
        locationResponse.data.city,
        locationResponse.data.region,
        locationResponse.data.country_name
      ].filter(Boolean).join(", ");
    } catch (error) {
      console.error("Failed to fetch IP/location", error);
    }

    // Parse user agent
    const parser = new UAParser();
    const result = parser.getResult();

    return {
      "X-Client-IP": clientIp,
      "X-Client-Location": clientLocation,
      "X-Client-Device": result.device.model || navigator.platform,
      "X-Client-OS": result.os.name || "unknown",
      "X-Client-Browser": result.browser.name || "unknown",
      "X-Client-Time": new Date().toISOString(),
      "X-Client-User-Agent": navigator.userAgent,
      "X-Client-Platform": navigator.platform,
    };
  }
}

export default new Axios();
