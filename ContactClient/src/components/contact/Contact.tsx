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
import { Edit, Eye, Send, Trash, View } from "lucide-react";
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
import { ChangeEvent, useState } from "react";
import apiStore from "@/api/apiStore";

interface ContactProps {
    search: string;
    Contacts: any[];
}
interface ContactFormData {
    id: UUID | any;
    file: File | null;
    name: string;
    email: string;
    phone: string;
}

const Contact = ({ search, Contacts }: ContactProps) => {
    // console.log("search=>", search);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const [contactDetails, setContactDetails] = useState<ContactFormData>({
        id: "",
        file: null,
        name: "",
        email: "",
        phone: "",
    });
    const changes=(e: ChangeEvent<HTMLInputElement>)=>{
        const { id, value } = e.target;
        setContactDetails((prev) => ({
            ...prev,
            [id]: value,
        }));
    }
    const updateContact=(contactId:any)=>{

    }
    const deleteContact = async (contactID: any) => {
        await apiStore.deletecontact(contactID);
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
                    {Contacts.map((contact, index) => (
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
                            <TableCell className="text-center">
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
                                            <DialogDescription asChild>
                                                <div className="pt-3 flex justify-center">
                                                    <Button
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                        onClick={() =>
                                                            deleteContact(
                                                                contact.contactId
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </DialogDescription>
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
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white dark:bg-gray-700">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-white">
                                                Edit Contact
                                            </DialogTitle>
                                            <DialogDescription asChild>
                                                <form className="mt-4 space-y-4" onSubmit={()=>updateContact(contact.contactId)}>
                                                    {/* Profile Image Upload */}
                                                    <div className="relative w-28 h-28 mx-auto">
                                                        {previewImage ? (
                                                            <img
                                                                src={
                                                                    previewImage
                                                                }
                                                                alt="Preview"
                                                                className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border border-gray-400 shadow-md z-0"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={
                                                                    contact.mediaURL
                                                                }
                                                                className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border border-gray-400 shadow-md z-0"
                                                            />
                                                        )}
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleImageChange
                                                            }
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
                                                            value={contact.name}
                                                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                            onChange={changes}
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
                                                            value={
                                                                contact.email
                                                            }
                                                            onChange={changes}
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
                                                            value={
                                                                contact.phone
                                                            }
                                                            onChange={changes}
                                                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    {/* Submit */}
                                                    <div className="pt-4 text-center">
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 active:scale-95"
                                                        >
                                                            <Send className="h-4 w-4" />
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                                {/* View Sheet */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost">
                                            <Eye />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="bg-white dark:bg-gray-700 border-0">
                                        <SheetHeader>
                                            <SheetTitle className="dark:text-white">
                                                Contact Info
                                            </SheetTitle>
                                            <SheetDescription className="dark:text-gray-300">
                                                This would contain more detailed
                                                contact info and actions.
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </motion.div>
    );
};

export default Contact;
