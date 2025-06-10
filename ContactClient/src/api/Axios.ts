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

// import axios from "axios";
// import {UAParser} from "ua-parser-js";
// const { browser, cpu, device } = UAParser('Mozilla/5.0 (X11; U; Linux armv7l; en-GB; rv:1.9.2a1pre) Gecko/20090928 Firefox/3.5 Maemo Browser 1.4.1.22 RX-51 N900');

// console.log(browser.name);          // Maemo Browser
// console.log(cpu.is('arm'));         // true
// console.log(device.is('mobile'));   // true
// console.log(device.model);          // N900
// class  Axios{
//     axiosInstanceSecure = axios.create({
//         baseURL: "http://localhost:8569/secure/",
//         withCredentials: true,
//         headers: {
//             Accept: "application/json",
//             "X-Requested-With": "XMLHttpRequest",
//             // "X-Client-IP": "unknown",
//             // "X-Client-Location": "unknown",
//             // "X-Client-Device": navigator.platform,
//             // "X-Client-Time": new Date().toISOString(),
//             // "X-Client-User-Agent": navigator.userAgent,
//             // "X-Client-Platform": navigator.platform,    
//         },
//     });  

//     axiosInstance = axios.create({
//         baseURL: "http://localhost:8569/api/v1/",
//         withCredentials: true,
//         headers: {
//             Accept: "application/json",
//             "X-Requested-With": "XMLHttpRequest",
//             // "X-Client-IP": "unknown",
//             // "X-Client-Location": "unknown",
//             // "X-Client-Device": "unknown",
//             // "X-Client-Time": new Date().toISOString(),
//             // "X-Client-User-Agent": navigator.userAgent,
//             // "X-Client-Platform": navigator.platform,    
//         },
//     });

//   public getClientHeaders() {
//     return {
//       "X-Client-IP": "unknown",
//       "X-Client-Location": "unknown",
//       "X-Client-Device": navigator.platform,
//       "X-Client-Time": new Date().toISOString(),
//       "X-Client-User-Agent": navigator.userAgent,
//       "X-Client-Platform": navigator.platform,
//     };
//   }
// }
// export default new Axios();

