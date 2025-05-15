import axios from "axios";
class  Axios{
    axiosInstanceSecure = axios.create({
        baseURL: "http://localhost:8569/secure/",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });
    axiosInstance = axios.create({
        baseURL: "http://localhost:8569/api/v1/",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export default new Axios();

// export default { axiosInstanceSecure, axiosInstance };
