import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Edit, Eye, Send, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { UUID } from "crypto";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChangeEvent, useState, useEffect } from "react";
import apiStore from "@/api/apiStore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/SliceStore";
import { toast } from "sonner";

interface ContactProps {
    search: string;
    Contacts: any[];
    onContactChange: () => void; 
}

interface ContactFormData {
    id: UUID | null;
    file: File | null;
    name: string;
    email: string;
    phone: string;
}

const Contact = ({ search, Contacts,onContactChange }: ContactProps) => {
    const userID = useSelector((state: RootState) => state.user.userID);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [contactDetails, setContactDetails] = useState<ContactFormData>({
        id: null,
        file: null,
        name: "",
        email: "",
        phone: "",
    });

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setContactDetails(prev => ({
                ...prev,
                file
            }));
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setContactDetails(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const initializeFormData = (contact: any) => {
        setContactDetails({
            id: contact.contactId,
            file: null,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        });
        setPreviewImage(contact.mediaUrl || null);
    };

    const updateContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactDetails.id) return;
        
        setIsUpdating(true);
        try {
            await apiStore.updateContact(contactDetails.id, contactDetails, userID);
            toast.success("Contact updated successfully");
            onContactChange();  // Call the refresh function
        } catch (error) {
            console.error("Failed to update contact:", error);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const deleteContact = async (contactId: UUID) => {
        setIsDeleting(true);
        try {
            await apiStore.deleteContact(contactId,userID);
            toast.success("Contact deleted successfully");
            onContactChange();  // Call the refresh function
        } catch (error) {
            console.error("Failed to delete contact:", error);
            toast.error("Failed to delete contact");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div className="px-5 overflow-y-auto max-h-[80vh] bg-gray-50 dark:bg-gray-700 text-black dark:text-gray-200 transition-colors duration-300">
            <Table className="w-full">
                <TableCaption className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Your contact list
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        {[
                            "Profile Photo",
                            "Name",
                            "Email",
                            "Phone No.",
                            "Action",
                        ].map((heading, i) => (
                            <TableHead key={i} className="text-center">
                                {heading}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                {Contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone.includes(search)
    ).length === 0 ? (
        <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-300">
                No contacts found
            </TableCell>
            {/* <TableCell colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-300">
                <span>
                <img
                    className="h-[20rem] w-fit rounded-full"
                    src="NotFound.png"
                    alt="No contacts found"
                /> 
                </span>
            </TableCell> */}
        </TableRow>
    ) : (
        Contacts.filter((contact) =>
            contact.name.toLowerCase().includes(search.toLowerCase()) ||
            contact.email.toLowerCase().includes(search.toLowerCase()) ||
            contact.phone.includes(search)
        ).map((contact, index) => (
                        <motion.tr
                            key={contact.contactId}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border-b border-gray-300 dark:border-gray-600"
                        >
                            <TableCell className="text-center">
                                {contact.mediaUrl ? (
                                    <img
                                        src={contact.mediaUrl}
                                        alt={contact.name}
                                        className="w-10 h-10 rounded-full mx-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full mx-auto shadow-lg bg-white dark:bg-gray-600" />
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                {contact.name}
                            </TableCell>
                            <TableCell className="text-center">
                                {contact.email}
                            </TableCell>
                            <TableCell className="text-center">
                                {contact.phone}
                            </TableCell>
                            <TableCell className="text-center flex justify-center gap-1">
                                {/* Delete Dialog */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white dark:bg-gray-700">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-white">
                                                Are you absolutely sure?
                                            </DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete the contact.
                                            </DialogDescription>
                                            <div className="pt-3 flex justify-center gap-4">
                                                <Button
                                                    variant="outline"
                                                    className="dark:text-white"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => deleteContact(contact.contactId)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                                {/* Edit Dialog */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => initializeFormData(contact)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white dark:bg-gray-700 max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-white">
                                                Edit Contact
                                            </DialogTitle>
                                            <DialogDescription>
                                                <form className="mt-4 space-y-4" onSubmit={updateContact}>
                                                    {/* Profile Image Upload */}
                                                    <div className="relative w-28 h-28 mx-auto">
                                                        {previewImage ? (
                                                            <img
                                                                src={previewImage}
                                                                alt="Preview"
                                                                className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border border-gray-400 shadow-md z-0"
                                                            />
                                                        ) : (
                                                            contact.mediaUrl && (
                                                                <img
                                                                    src={contact.mediaUrl}
                                                                    className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border border-gray-400 shadow-md z-0"
                                                                />
                                                            )
                                                        )}
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="absolute top-0 left-0 w-28 h-28 rounded-full opacity-0 z-10 cursor-pointer"
                                                        />
                                                        <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center z-5 text-xs text-gray-600 dark:text-gray-300 pointer-events-none">
                                                            Upload
                                                        </div>
                                                    </div>

                                                    {/* Name */}
                                                    <div>
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-sm text-gray-700 dark:text-gray-300"
                                                        >
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={contactDetails.name}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <Label
                                                            htmlFor="email"
                                                            className="text-sm text-gray-700 dark:text-gray-300"
                                                        >
                                                            Email
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={contactDetails.email}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    {/* Phone */}
                                                    <div>
                                                        <Label
                                                            htmlFor="phone"
                                                            className="text-sm text-gray-700 dark:text-gray-300"
                                                        >
                                                            Phone No.
                                                        </Label>
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            value={contactDetails.phone}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    {/* Submit */}
                                                    <div className="pt-4 text-center">
                                                        <Button
                                                            type="submit"
                                                            className="inline-flex items-center gap-2"
                                                            disabled={isUpdating}
                                                        >
                                                            {isUpdating ? (
                                                                "Updating..."
                                                            ) : (
                                                                <>
                                                                    <Send className="h-4 w-4" />
                                                                    Update Contact
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                                {/* View Sheet */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="bg-white dark:bg-gray-700 border-0">
                                        <SheetHeader>
                                            <SheetTitle className="dark:text-white">
                                                Contact Details
                                            </SheetTitle>
                                            <SheetDescription className="dark:text-gray-300">
                                                <div className="mt-6 space-y-4">
                                                    <div className="flex justify-center">
                                                        {contact.mediaUrl ? (
                                                            <img
                                                                src={contact.mediaUrl}
                                                                alt={contact.name}
                                                                className="w-24 h-24 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-center dark:text-white">
                                                            {contact.name}
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <Label className="text-gray-600 dark:text-gray-400">Email</Label>
                                                            <p className="dark:text-white">{contact.email}</p>
                                                        </div>
                                                        <div>
                                                            <Label className="text-gray-600 dark:text-gray-400">Phone</Label>
                                                            <p className="dark:text-white">{contact.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </TableCell>
                        </motion.tr>
                    ))
                )}
                </TableBody>
            </Table>
        </motion.div>
    );
};

export default Contact;