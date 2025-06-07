import axios from "axios";
class  Axios{
    axiosInstanceSecure = axios.create({
        baseURL: "http://localhost:8569/secure/",
        withCredentials: true,
        headers: {
            // "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-Client-IP": "unknown",
            "X-Client-Location": "unknown",
            "X-Client-Device": "unknown",
            "X-Client-Time": new Date().toISOString(),
            "X-Client-User-Agent": navigator.userAgent,
            "X-Client-Platform": navigator.platform,    
        },
    });  

    axiosInstance = axios.create({
        baseURL: "http://localhost:8569/api/v1/",
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-Client-IP": "unknown",
            "X-Client-Location": "unknown",
            "X-Client-Device": "unknown",
            "X-Client-Time": new Date().toISOString(),
            "X-Client-User-Agent": navigator.userAgent,
            "X-Client-Platform": navigator.platform,    
        },
    });
}
export default new Axios();


// import axios from "axios";

// class Axios {
//   axiosInstanceSecure = axios.create({
//     baseURL: "http://localhost:8569/secure/",
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   axiosInstance = axios.create({
//     baseURL: "http://localhost:8569/api/v1/",
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   constructor() {
//     this.setupInterceptors();
//   }

//   private async getClientInfo() {
//     try {
//       // Get public IP
//       const ipResponse = await axios.get('https://api.ipify.org?format=json');
//       const publicIp = ipResponse.data.ip;
      
//       // Get approximate location (this is a simple free service)
//       let location = "Unknown";
//       try {
//         const locationResponse = await axios.get(`https://ipapi.co/${publicIp}/country_name/`);
//         location = locationResponse.data;
//       } catch (e) {
//         console.error("Could not fetch location", e);
//       }

//       // Get device info (note: in browsers this is limited)
//       const userAgent = navigator.userAgent;
      
//       // Get current time
//       const currentTime = new Date().toISOString();

//       return {
//         ip: publicIp,
//         location,
//         device: userAgent,
//         time: currentTime
//       };
//     } catch (error) {
//       console.error("Error gathering client info:", error);
//       return {
//         ip: "unknown",
//         location: "unknown",
//         device: "unknown",
//         time: new Date().toISOString()
//       };
//     }
//   }

//   private setupInterceptors() {
//     // Add request interceptor to both instances
//     const injectHeaders = async (config: any) => {
//       const clientInfo = await this.getClientInfo();
//       config.headers['X-Client-IP'] = clientInfo.ip;
//       config.headers['X-Client-Location'] = clientInfo.location;
//       config.headers['X-Client-Device'] = clientInfo.device;
//       config.headers['X-Client-Time'] = clientInfo.time;
//       return config;
//     };

//     this.axiosInstance.interceptors.request.use(injectHeaders);
//     this.axiosInstanceSecure.interceptors.request.use(injectHeaders);
//   }
// }

// export default new Axios();