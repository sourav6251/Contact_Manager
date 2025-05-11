import apiStore from "@/api/apiStore";
import { RootState } from "@/redux/SliceStore";
// import { profile } from "console";
import { UUID } from "crypto";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
const UpdateProfile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const userID: any = useSelector((state: RootState) => state.user.userID);
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const [updating,setUpdating]=useState(false)

    // const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setPhoto(file);
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            // setIsPhotoUpdated(true); // 👈 mark it as changed
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiStore.featchProfile(userID);
                const user = response.user;
                console.log(user);

                setName(user.name);
                setEmail(user.email);
                if (user.mediaUrl) setPreview(user.mediaUrl); // show existing profile picture
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };

        if (userID) {
            fetchProfile();
        }
        console.log("hi");
        
    }, [userID , isProfileUpdated]);
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Please fill in all fields");
            return;
        }
        setUpdating(true)
        const profile: profile = {
            name: name,
            email: email,
            media: photo,
            userId: userID,
        };
       const response= await apiStore.updateProfile(profile);
       if (response==="success") {
        setIsProfileUpdated(true)
        
       }
        console.log({
            name,
            email,
            photo,
        });

        setIsProfileUpdated(false)

        setUpdating(false)
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6 border border-gray-200 dark:border-gray-700 mt-10"
        >
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                Update Profile
            </h2>

            {/* Photo Upload Section */}
            <div className="flex justify-center">
                <div className="relative group w-32 h-32">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
                        <Edit size={18} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Full Name Field */}
            <div className="space-y-1">
                <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Email Field */}
            {/* <div className="space-y-1">
                <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div> */}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {updating?<span>Updating ...... </span>:<span>Update Profile</span>}
                
            </button>
        </form>
    );
};

export default UpdateProfile;
