import { toast } from "sonner";
import axiosInstance from "./axiosInstance";
import { UUID } from "crypto";
import axios from "axios";
// import { v2 as cloudinary } from "cloudinary";
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
interface ContactFormData {
    id: UUID | null;
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
interface updatePassword {
    currentPassword: string;
    newPassword: string;
}
interface profile {
    // email: string,
    // mediaId:string | null,
    // mediaUrl : string
    // name : string
    // userId:UUID
    email: string;
    media: File | null;
    name: string;
    userId: UUID;
}

// cloudinary.config({
//     cloud_name: "dkxei4b5s",
//     api_key: "156732394766315",
//     api_secret: "nwkaLHN7giKg4rEVStTkUZW5918",
// });
class APIStore {
    private readonly cloudName: string;
    private readonly uploadPreset: string;

    constructor() {
        this.cloudName = "dkxei4b5s"; //import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        this.uploadPreset = "skd_product"; //import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
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
            return response.data;
        } catch (error) {
            toast.error("Try again");
        }
    }

    public async generateOTP(userID: UUID) {
        try {
            axiosInstance.get(`generateotp/${userID}`);
            toast.success("Otp send successfully");
        } catch (error) {
            toast.error("Please try again");
        }
    }

    public async verifyOTP(userID: UUID, otp: any) {
        try {
            const response = await axiosInstance.get(`verifyotp`, {
                params: {
                    userID: userID,
                    otp: otp,
                },
            });
            console.log("response=>", response);

            toast.success("Otp Verify successfully");
            return "success";
        } catch (error: any) {
            if (error.response.status === 404 && error.response === 404) {
                toast.error("User doesn't exist");
            }
            if (error.response.status === 400 && error.response === 400) {
                toast.error(error.response.data);
            }
            toast.error("Please try again");
            // throw  error;
            return "error";
        }
    }

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

    // private async deleteFromCloudinary(publicId: string): Promise<void> {
    //     try {
    //         const result = await cloudinary.uploader.destroy(publicId);
    //         if (result.result === "ok") {
    //             console.log("Deleted successfully");
    //         } else {
    //             console.log("Deletion failed:", result);
    //         }
    //     } catch (error) {
    //         console.error("Cloudinary deletion error:", error);
    //         throw error;
    //     }
    // }

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
                console.log("cloudinaryResponse=>", cloudinaryResponse);

                // 2. Prepare contact data with image URL
                contactData = {
                    name: contactDetails.name,
                    email: contactDetails.email,
                    phone: contactDetails.phone,
                    mediaUrl: cloudinaryResponse.url,
                    mediaId: cloudinaryResponse.publicId,
                };
            } else {
                // 1. Upload image to Cloudinary

                // 3. Save to backend
                contactData = {
                    name: contactDetails.name,
                    email: contactDetails.email,
                    phone: contactDetails.phone,
                    mediaUrl: "",
                    mediaId: "",
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

    public async showallContact(userID: any) {
        try {
            const response = await axiosInstance.get(
                `showallcontact/${userID}`
            );
            toast.success("Contact save successfully");

            // console.log("response=>",response);
            // console.log("response.data=>",response.data);
            // console.log("response.data.data=>",response.data.data);
            return response.data;
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    public async deleteContact(contactID: any) {
        try {
            const response = await axiosInstance.delete(
                `deletecontact/${contactID}`
            );
            toast.success("Contact delete successfully");
            return response.data;
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    public async updateContact(
        contactID: UUID,
        contactDetails: ContactFormData,
        userID: any
    ) {
        try {
            const response = await axiosInstance.put(
                `/updatecontact`,
                contactDetails, // This will be the request body
                {
                    params: {
                        userid: userID,
                        contactid: contactID,
                    },
                }
            );

            toast.success("Contact updated successfully");
            return response.data;
        } catch (error) {
            toast.error("Failed to update contact");
            console.error("Update contact error:", error);
            throw error; // Re-throw the error if you want to handle it in the component
        }
    }

    public async updateOldPassword(passwords: updatePassword, userID: any) {
        try {
            await axiosInstance.put(`updateoldpassword/${userID}`, passwords);
            toast.success("password Change Successfully");
        } catch (error: any) {
            // const status =error.response.status;
            // if (status===400) {
            toast.error(error.response.data.message);

            // }
            // toast.error()
        }
    }

    public async updatePassword(newPassword: string, userID: any) {
        const newPasswords = {
            newPassword: newPassword,
        };

        try {
            await axiosInstance.put(`updatepassword/${userID}`, newPasswords);
            toast.success("password Change Successfully");
            //    console.log("response=>",response);
            return "success";
        } catch (error: any) {
            // const status =error.response.status;
            // if (status===400) {
            toast.error(error.response.data.message);

            // }
            // toast.error()
        }
    }

    public async updateProfile(profile: profile) {
        let profileData;
        if (profile.media != null) {
            const { url, publicId } = await this.uploadToCloudinary(
                profile.media
            );
            profileData = {
                // email: profile.email,
                mediaId: publicId,
                mediaUrl: url,
                name: profile.name,
                // userId:UUID
            };
        } else {
            profileData = {
                email: profile.email,
                name: profile.name,
            };
        }

        try {
            axiosInstance.put(`updateprofile/${profile.userId}`, profileData);
            toast.success("Profile Update Successfully")
            return "success"
        } catch (error) {
            console.error(error);
            toast.error("Please try again")
            return "error"
        }
    }
}

export default new APIStore();
