import { toast } from "sonner";
import { UUID } from "crypto";
import Axios from "./Axios";

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
interface updatePassword {
    currentPassword: string;
    newPassword: string;
}
interface profile {
    email: string;
    media: File | null;
    name: string;
    userId: UUID;
}
interface UserData {
    email: string;
    media: string;
    name: string;
    userId: string | null;
    status: number;
}

class APIStore {
    public async register(name: String, email: String, password: String) {
        const data = {
            name: name,
            email: email,
            newPassword: password,
        };
        try {
            const headers = await Axios.getClientHeaders();
            const resonse = await Axios.axiosInstance.post("/register", data, {
                headers: headers,
            });
            console.log(resonse);

            toast.success("User create sucessfully");
            const userData: UserData = {
                email: resonse.data.email,
                media: resonse.data.mediaUrl,
                name: resonse.data.name,
                userId: resonse.data.userId,
                status: resonse.status,
            };

            return userData;
        } catch (error: any) {
            if (error.response?.data?.newPassword) {
                toast.warning(
                    `Password error: ${error.response.data.newPassword}`
                );
            }
            if (error.response?.data?.name) {
                toast.warning(`Name error: ${error.response.data.name}`);
            }
            if (error.response?.data?.email) {
                toast.warning(`Email error: ${error.response.data.email}`);
            }
            if (error.response?.data) {
                toast.error(`${error.response.data}`);
            } else {
                toast.warning("Registration failed. Please try again.");
            }
        }
    }

    public async login(email: String, password: String) {
        const headers = await Axios.getClientHeaders();
        try {
            const response = await Axios.axiosInstance.get("login", {
                params: {
                    email: email,
                    password: password,
                },
                headers,
            });
            console.log("response=>", response);

            return response;
        } catch (error: any) {
            // toast.error("Try again");
            toast.error(error.response.data);
        }
    }

    public async logout() {
        try {
            const resonse = await Axios.axiosInstance.get("logout");
            console.log("Logout call");

            toast.success("Logoout Successful");
            return resonse.status;
        } catch (error) {
            toast.error("Something wrong");
        }
    }

    public async featchProfile(userID: UUID) {
        try {
            const response = await Axios.axiosInstanceSecure.get(
                `showuserbyid/${userID}`
            );
            return response.data;
        } catch (error) {
            toast.error("Try again");
        }
    }

    public async generateOTP(userID: string | null, otpFor: String) {
        const headers = await Axios.getClientHeaders();
        console.log("userID=>", userID);

        try {
            await Axios.axiosInstanceSecure.get(`generateotp/${userID}`, {
                params: {
                    otpFor: otpFor,
                },
                headers: headers,
            });
            toast.success("Otp send successfully");
        } catch (error) {
            console.error("error=>", error);
            toast.error("Please try again");
        }
    }

    public async verifyOTP(userID: string | null, otp: any) {
        try {
            const response = await Axios.axiosInstanceSecure.get(
                `verifyotp/${userID}`,
                {
                    params: {
                        userID: userID,
                        otp: otp,
                    },
                }
            );
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
            toast.error(error.response.data);
            return "error";
        }
    }

    public async isVerifiedUser(userID: string | null) {
        try {
            const response = await Axios.axiosInstanceSecure.get(
                `isverified/${userID}`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async saveContact(contactDetails: Contact, userID: any) {
        const formData = new FormData();
        formData.append("name", contactDetails.name);
        formData.append("email", contactDetails.email);
        formData.append("phone", contactDetails.phone);
        if (contactDetails.file) {
            formData.append("file", contactDetails.file);
        }

        try {
            await Axios.axiosInstanceSecure.post(
                `createcontact/${userID}`,
                formData
            );
            toast.success("Contact saved successfully");
        } catch (error: any) {
            toast.error(error.response.data);
            console.error("Error saving contact:", error);
            throw error; // Re-throw the error if you want to handle it in the component
        }
    }

    public async showallContact(userID: any) {
        try {
            const response = await Axios.axiosInstanceSecure.get(
                `showallcontact/${userID}`
            );
            toast.success("Contact save successfully");
            return response.data;
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    }

    public async deleteContact(contactID: any, userID: string | null) {
        try {
            const response = await Axios.axiosInstanceSecure.delete(
                `deletecontact/${userID}`,
                {
                    params: {
                        contactID: contactID,
                    },
                }
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
            const formData = new FormData();
            formData.append("name", contactDetails.name);
            formData.append("email", contactDetails.email);
            // formData.append("phone", contactDetails.phone);
            formData.append("contactID", contactID);
            console.log("formData=>", formData.get("name"));
            console.log("formData=>", formData.get("email"));
            console.log("formData=>", formData.get("phone"));
            console.log("formData=>", formData.get("phone"));
            console.log("contactDetails.file=>", contactDetails.file);

            if (contactDetails.file) {
                formData.append("file", contactDetails.file);
            }
            const response = await Axios.axiosInstanceSecure.put(
                `/updatecontact/${userID}`,
                formData
            );

            toast.success("Contact updated successfully");
            return response.data;
        } catch (error: any) {
            toast.error(error.response.data);
            console.error("Update contact error:", error.response.data);
            throw error;
        }
    }

    public async updateOldPassword(passwords: updatePassword, userID: any) {
        const headers = await Axios.getClientHeaders();
        try {
            await Axios.axiosInstanceSecure.put(
                `updateoldpassword/${userID}`,
                passwords,
                {
                    headers: headers,
                }
            );
            toast.success("password Change Successfully");
        } catch (error: any) {
            // const status =error.response.status;
            // if (status===400) {
            console.log("error=>", error.response);

            toast.error(error.response.data);

            // }
            // toast.error()
        }
    }

    public async updatePassword(newPassword: string, userID: any) {
        const newPasswords = {
            newPassword: newPassword,
        };

        try {
            await Axios.axiosInstanceSecure.put(
                `updatepassword/${userID}`,
                newPasswords
            );
            toast.success("password Change Successfully");
            //    console.log("response=>",response);
            return "success";
        } catch (error: any) {
            // const status =error.response.status;
            // if (status===400) {
            toast.error(error.response.data);

            // }
            // toast.error()
        }
    }

    public async updateProfile(profile: profile) {
        const formData = new FormData();
        formData.append("name", profile.name);
        if (profile.media) {
            formData.append("file", profile.media);
        }
        try {
            const headers = await Axios.getClientHeaders();
            await Axios.axiosInstanceSecure.put(
                `updateprofile/${profile.userId}`,
                formData,
                {
                    headers: headers,
                }
            );
            toast.success("Profile Update Successfully");
            return "success";
        } catch (error) {
            console.error(error);
            toast.error("Please try again");
            return "error";
        }
    }

    public async deleteAccount(userID: string | null) {
        try {
            Axios.axiosInstanceSecure.delete(`deleteuser/${userID}`);
            toast.success("Account delete succesfully");
            return "success";
        } catch (error: any) {
            toast.error(error.response.data);
        }
    }

    public async contactpage(
        userID: UUID,
        query: String,
        page: Number,
        contactno: Number
    ) {
        try{
           const data=await Axios.axiosInstanceSecure.get("/contactpage", {
            params: {
                UserID: userID,
                query: query,
                page: page,
                contactno: contactno,
            },});
            console.log(data);
            
        return data;
        
        }catch(error:any){
            console.error("Error fetching contact page:", error);
            toast.error("Failed to fetch contacts. Please try again.");
            throw error; // Re-throw the error if you want to handle it in the component
        }
    }
}

export default new APIStore();
