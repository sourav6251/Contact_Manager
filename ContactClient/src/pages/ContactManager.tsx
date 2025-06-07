import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/SliceStore";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { Send } from "lucide-react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import apiStore from "@/api/apiStore";
import Contact from "@/components/contact/Contact";
import { toast } from "sonner";

interface ContactFormData {
    file: File | null;
    name: string;
    email: string;
    phone: string;
}

interface Contact {
    contactId: string;
    mediaURL: string;
    name: string;
    email: string;
    phone: string;
    mediaId?: string;
}

const ContactManager = () => {
    const userID = useSelector((state: RootState) => state.user.userID);
    const userName = useSelector((state: RootState) => state.user.userName);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [isVerified, setIsVerfied] = useState(false);
    const [contactDetails, setContactDetails] = useState<ContactFormData>({
        file: null,
        name: "",
        email: "",
        phone: "",
    });
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setContactDetails((prev) => ({ ...prev, file }));
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setContactDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    };
    const handleContactChange = () => {
        fetchContacts();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // if (!contactDetails.file) {
        //     toast.warning("Please select a profile image");
        //     return;
        // }
        if (!contactDetails.name) {
            toast.warning("Please enter a name");
            return;
        }
        if (!contactDetails.phone) {
            toast.warning("Please enter a phone number");
            return;
        }

        setSubmitting(true);
        try {
            await apiStore.saveContact(contactDetails, userID);

            setContactDetails({ file: null, name: "", email: "", phone: "" });
            setPreviewImage(null);
            fetchContacts();
        } catch  {
            // toast.error("Failed to save contact");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await apiStore.showallContact(userID);
            setContacts(response || []);
            console.log("contacts=>", response);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    const checkIsVerified = async () => {
        const response = await apiStore.isVerifiedUser(userID);
        console.log("checkIsVerified=> ", response);

        setIsVerfied(response);
    };
    useEffect(() => {
        fetchContacts();
        checkIsVerified();
    }, [userID]);

    return (
        <PageWrapper>
            <div className="bg-gray-50 dark:bg-gray-700 min-h-screen transition-colors duration-300">
                <div className="pt-16 flex items-center justify-between px-5 pb-5">
                    <Input
                        className="w-[20%] rounded-3xl p-3 bg-white dark:bg-gray-500 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-200 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
                        placeholder="Search ......"
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Dialog>
                        <DialogTrigger className="bg-transparent" asChild>
                            <Button
                                className="p-2 bg-black text-white hover:bg-gray-800 transition-colors"
                                disabled={!isVerified}
                            >
                                <Plus />
                                Add Contact
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="bg-white dark:bg-gray-800 border-0 transition-colors duration-300">
                            <DialogHeader>
                                <DialogTitle className="text-center text-xl font-semibold text-gray-800 dark:text-white">
                                    Hi {userName}, Add Your Contact
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <form
                                        className="mt-4 space-y-4"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="relative w-28 h-28 mx-auto">
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border border-gray-400 dark:border-gray-600 shadow-md z-0"
                                                />
                                            )}
                                            <Input
                                                id="file"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute top-0 left-0 w-28 h-28 rounded-full opacity-0 z-10 cursor-pointer"
                                            />
                                            <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center z-5 text-xs text-gray-600 dark:text-gray-300 pointer-events-none">
                                                Upload
                                            </div>
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={contactDetails.name}
                                                onChange={handleFormChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={contactDetails.email}
                                                onChange={handleFormChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Phone No.
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="123-456-7890"
                                                value={contactDetails.phone}
                                                onChange={handleFormChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                                            />
                                        </div>

                                        <div className="pt-4 text-center">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg shadow-md transition-all duration-200 active:scale-95 ${
                                                    submitting
                                                        ? "bg-blue-400 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                                }`}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin h-4 w-4 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                            />
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="h-4 w-4" />
                                                        Submit
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <div>
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : contacts.length === 0 ? (
                        <div className="flex justify-center items-center py-10">
                            {" "}
                            <img
                                className="h-[20rem] w-fit rounded-full bg-blend-color-burn"
                                style={{ mixBlendMode: "luminosity" }}
                                src="NotFound.png"
                                alt="No contacts found"
                            />{" "}
                        </div>
                    ) : (
                        <>
                            <Contact
                                Contacts={contacts}
                                search={search}
                                onContactChange={handleContactChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default ContactManager;
