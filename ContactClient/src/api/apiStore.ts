import { toast } from "sonner";
import axiosInstance from "./axiosInstance";
import { UUID } from "crypto";
import axios from "axios";
// Cloudinary type declarations
interface CloudinaryUploadResult {
    url: string;
    publicId: string;
}

interface CloudinaryUploadWidgetInfo {
    secure_url: string;
    public_id: string;
    [key: string]: any;
}
interface Contact {
    file: File | null;
    name: string;
    email: string;
    phone: string;
}

declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                config: Record<string, any>,
                callback: (
                    error: Error | null,
                    result: { event: string; info: CloudinaryUploadWidgetInfo }
                ) => void
            ) => any;
        };
    }
}

class APIStore {
    private readonly cloudName: string;
    private readonly uploadPreset: string;

    constructor() {
        this.cloudName = 'dkxei4b5s'//import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        this.uploadPreset = 'skd_product'//import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    }

    public async register(name: String, email: String, password: String) {
        const data = {
            name: name,
            email: email,
            newPassword: password,
        };
        try {
            const resonse = await axiosInstance.post("/register", data);
            console.log(resonse);
            toast.success("User create sucessfully");

            return 200;
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error("User already exists");
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    public async login(email: String, password: String) {
        try {
            const response = await axiosInstance.get("login", {
                params: {
                    email: email,
                    password: password,
                },
            });
            return response;
        } catch (error) {
            toast.error("Try again");
        }
    }

    public async featchProfile(userID: UUID) {
        try {
            const response = await axiosInstance.get(`showuserbyid/${userID}`);
            return response;
        } catch (error) {
            toast.error("Try again");
        }
    }

    public async generateOTP(email: String) {
        try {
            axiosInstance.get(`generateotp/${email}`);
            toast.success("Otp send successfully");
        } catch (error) {
            toast.error("Please try again");
        }
    }

    public async verifyOTP(email: String, otp: any) {
        try {
            axiosInstance.get(`verifyotp`, {
                params: {
                    email: email,
                    otp: otp,
                },
            });
            toast.success("Otp Verify successfully");
        } catch (error: any) {
            if (error.response.status === 404 && error.response === 404) {
                toast.error("User doesn't exist");
            }
            if (error.response.status === 400 && error.response === 400) {
                toast.error(error.response.data);
            }
            toast.error("Please try again");
        }
    }

    // Update the Cloudinary upload method to handle direct file uploads
    private async uploadToCloudinary(
        file: File
    ): Promise<CloudinaryUploadResult> {
        try {
            // Convert file to Base64
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Create form data
            const formData = new FormData();
            formData.append("file", base64);
            formData.append("upload_preset", this.uploadPreset);
            formData.append("folder", "Contact");

            // Upload to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return {
                url: response.data.secure_url,
                publicId: response.data.public_id,
            };
        } catch (error) {
            toast.error("File upload failed");
            throw error;
        }
    }

    // Updated saveContact method
    public async saveContact(contactDetails: Contact, userID: any) {
        let cloudinaryResponse;
        let contactData = {
            name: "",
            email: "",
            phone: "",
            mediaUrl: "",
            mediaId: "",
        };
        try {
            if (contactDetails.file != null) {
                cloudinaryResponse = await this.uploadToCloudinary(
                    contactDetails.file
                );
console.log("cloudinaryResponse=>",cloudinaryResponse);

                // 2. Prepare contact data with image URL
                contactData = {
                    name: contactDetails.name,
                    email: contactDetails.email,
                    phone: contactDetails.phone,
                    mediaUrl: cloudinaryResponse.url,
                    mediaId: cloudinaryResponse.publicId,
                };
            }else{
            // 1. Upload image to Cloudinary

            // 3. Save to backend
            contactData = {
                name: contactDetails.name,
                email: contactDetails.email,
                phone: contactDetails.phone,
                mediaUrl: '',
                mediaId: '',
            };
            }

            await axiosInstance.post(`createcontact/${userID}`, contactData);
            toast.success("Contact saved successfully");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to save contact"
            );
            throw error;
        }
    }

    public async showallContact(userID:any){
        try {
            const response= await axiosInstance.get(`showallcontact/${userID}`)
            toast.success("Contact save successfully")

        // console.log("response=>",response);
        // console.log("response.data=>",response.data);
        // console.log("response.data.data=>",response.data.data);
            return  response.data;
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        }
    }
    public async deletecontact(contactID:any){
        try {
            const response= await axiosInstance.delete(`deletecontact/${contactID}`)
            toast.success("Contact delete successfully")
            return  response.data;
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        }
    }
}

export default new APIStore();
