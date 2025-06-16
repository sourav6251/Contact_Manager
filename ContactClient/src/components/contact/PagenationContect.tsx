import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import apiStore from "@/api/apiStore";
import { RootState } from "@/redux/SliceStore";
import { useSelector } from "react-redux";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Edit, Eye, Send, Trash } from "lucide-react";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { UUID } from "crypto";

interface Contact {
    contactId: string;
    email: string;
    mediaId: string;
    mediaUrl: string;
    name: string;
    phone: string;
    share: boolean;
    shareExpire: string | null;
}

interface ContactFormData {
    id: UUID | null;
    file: File | null;
    name: string;
    email: string;
    phone: string;
}
const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

        startPage = Math.max(currentPage - maxPagesBeforeCurrent, 1);
        endPage = Math.min(currentPage + maxPagesAfterCurrent, totalPages);

        if (endPage - startPage < maxPagesToShow - 1) {
            if (startPage === 1) {
                endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
            } else {
                startPage = Math.max(endPage - maxPagesToShow + 1, 1);
            }
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (startPage > 1) {
        pages.unshift("start-ellipsis");
    }
    if (endPage < totalPages) {
        pages.push("end-ellipsis");
    }

    return pages;
};

const PagenationContect = () => {
    const [query, setQuery] = useState("");
    const userID: any = useSelector((state: RootState) => state.user.userID);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItem] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
      const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<ContactFormData>({
        id: null,
        file: null,
        name: "",
        email: "",
        phone: "",
    });

    const contactpage = async () => {
        console.log("API called");
        try {
            const response = await apiStore.contactpage(
                userID,
                query,
                currentPage,
                totalItem
            );
            console.log("response=> ", response);
            setTotalPages(response.data.totalPages || 0);
            setContacts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    // Call API on first load
    useEffect(() => {
        contactpage();
    }, []);

    // Call API when totalItem or currentPage changes
    useEffect(() => {
        contactpage();
    }, [totalItem, currentPage]);

    // Call API with debounce when query changes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            contactpage();
        }, 2000);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const deleteContact = async (contactId: string) => {
        setIsDeleting(true);
        try {
            await apiStore.deleteContact(contactId, userID);
            toast.success("Contact deleted successfully");
            contactpage();
        } catch (error) {
            console.error("Failed to delete contact:", error);
            toast.error("Failed to delete contact");
        } finally {
            setIsDeleting(false);
        }
    };
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

    const updateContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactDetails.id) return;
        
        setIsUpdating(true);
        try {
            await apiStore.updateContact(contactDetails.id, contactDetails, userID);
            toast.success("Contact updated successfully");
            contactpage()
        } catch (error) {
            console.error("Failed to update contact:", error);
        } finally {
            setIsUpdating(false);
        }
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

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    return (
        <div className="flex flex-col gap-4 mx-6 mb-5 mt-16">
            <div className="flex items-center justify-between ">
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="focus:border-none w-[20%] rounded-3xl p-3 bg-white dark:bg-gray-500 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-200 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
                    placeholder="Search ..."
                />

                <DropdownMenu>
                    <DropdownMenuTrigger className="border-[1px] rounded-2xl w-20">
                        {totalItem}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Items per page</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[10, 20, 30, 40, 50].map((item) => (
                            <DropdownMenuItem
                                key={item}
                                onClick={() => {
                                    setTotalItem(item);
                                    setCurrentPage(1);
                                }}
                            >
                                {item}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="relative flex-1">
                {/* <div className="relative flex-1"> */}
                <div className="max-h-[450px] overflow-y-auto rounded-md border">
                    <Table>
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
                            {contacts.length > 0 ? (
                                contacts.map((contact, index) => (
                                    <motion.tr
                                        key={contact.contactId}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                        }}
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
                                                            Are you absolutely
                                                            sure?
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            the contact.
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
                                                                onClick={() =>
                                                                    deleteContact(
                                                                        contact.contactId
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                            >
                                                                {isDeleting
                                                                    ? "Deleting..."
                                                                    : "Delete"}
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
                                                            <form
                                                                className="mt-4 space-y-4"
                                                                 onSubmit={updateContact}
                                                            >
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

                                                                <div>
                                                                    <Label
                                                                        htmlFor="phone"
                                                                        className="text-sm text-gray-700 dark:text-gray-300"
                                                                    >
                                                                        Phone
                                                                        No.
                                                                    </Label>
                                                                    <Input
                                                                        id="phone"
                                                                        type="tel"
                                                                        value={contactDetails.phone}
                                                                        onChange={handleInputChange}
                                                                        className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                                    />
                                                                </div>

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

                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
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
                                                                            src={
                                                                                contact.mediaUrl
                                                                            }
                                                                            alt={
                                                                                contact.name
                                                                            }
                                                                            className="w-24 h-24 rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-medium text-center dark:text-white">
                                                                        {
                                                                            contact.name
                                                                        }
                                                                    </h3>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <Label className="text-gray-600 dark:text-gray-400">
                                                                            Email
                                                                        </Label>
                                                                        <p className="dark:text-white">
                                                                            {
                                                                                contact.email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-gray-600 dark:text-gray-400">
                                                                            Phone
                                                                        </Label>
                                                                        <p className="dark:text-white">
                                                                            {
                                                                                contact.phone
                                                                            }
                                                                        </p>
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
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-5"
                                    >
                                        No contacts found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* </div> */}
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "start-ellipsis" ||
                            page === "end-ellipsis" ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() =>
                                        handlePageChange(page as number)
                                    }
                                    isActive={currentPage === page}
                                    className={
                                        currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "cursor-pointer"
                                    }
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={
                                currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PagenationContect;


// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import apiStore from "@/api/apiStore";
// import { RootState } from "@/redux/SliceStore";
// import { useSelector } from "react-redux";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

// // Interface for contact data
// interface Contact {
//     contactId: string;
//     email: string;
//     mediaId: string;
//     mediaUrl: string;
//     name: string;
//     phone: string;
//     share: boolean;
//     shareExpire: string | null;
// }

// // Function to generate page numbers for pagination
// const generatePageNumbers = (currentPage: number, totalPages: number) => {
//     const pages: (number | string)[] = [];
//     const maxPagesToShow = 5;
//     let startPage: number, endPage: number;

//     if (totalPages <= maxPagesToShow) {
//         startPage = 1;
//         endPage = totalPages;
//     } else {
//         const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
//         const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

//         startPage = Math.max(currentPage - maxPagesBeforeCurrent, 1);
//         endPage = Math.min(currentPage + maxPagesAfterCurrent, totalPages);

//         if (endPage - startPage < maxPagesToShow - 1) {
//             if (startPage === 1) {
//                 endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
//             } else {
//                 startPage = Math.max(endPage - maxPagesToShow + 1, 1);
//             }
//         }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//     }

//     if (startPage > 1) {
//         pages.unshift("start-ellipsis");
//     }
//     if (endPage < totalPages) {
//         pages.push("end-ellipsis");
//     }

//     return pages;
// };

// const PagenationContect = () => {
//     const [query, setQuery] = useState("");
//     const userID: any = useSelector((state: RootState) => state.user.userID);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalItem, setTotalItem] = useState(10);
//     const [totalPages, setTotalPages] = useState(0);
//     const [contacts, setContacts] = useState<Contact[]>([]);

//     const contactpage = async () => {
//         console.log("API called");
//         try {
//             const response = await apiStore.contactpage(
//                 userID,
//                 query,
//                 currentPage,
//                 totalItem
//             );
//             console.log("response=> ", response);
//             setTotalPages(response.data.totalPages || 0);
//             setContacts(response.data.data || []);
//         } catch (error) {
//             console.error("Error fetching contacts:", error);
//         }
//     };

//     // Call API on first load
//     useEffect(() => {
//         contactpage();
//     }, []);

//     // Call API when totalItem or currentPage changes
//     useEffect(() => {
//         contactpage();
//     }, [totalItem, currentPage]);

//     // Call API with debounce when query changes
//     useEffect(() => {
//         const delayDebounce = setTimeout(() => {
//             contactpage();
//         }, 2000);

//         return () => clearTimeout(delayDebounce);
//     }, [query]);

//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     const pageNumbers = generatePageNumbers(currentPage, totalPages);

//     return (
//         <div className="flex flex-col gap-4 mx-6 mb-5 mt-16">
//             <div className="flex items-center justify-between ">
//                 <Input
//                     value={query}
//                     onChange={(e) => {
//                         setQuery(e.target.value);
//                         setCurrentPage(1);
//                     }}
//                     className="focus:border-none w-[20%] rounded-3xl p-3 bg-white dark:bg-gray-500 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-200 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
//                     placeholder="Search ..."
//                 />

//                 <DropdownMenu>
//                     <DropdownMenuTrigger className="border-[1px] rounded-2xl w-20">
//                         {totalItem}
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                         <DropdownMenuLabel>Items per page</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         {[10, 20, 30, 40, 50].map((item) => (
//                             <DropdownMenuItem
//                                 key={item}
//                                 onClick={() => {
//                                     setTotalItem(item);
//                                     setCurrentPage(1);
//                                 }}
//                             >
//                                 {item}
//                             </DropdownMenuItem>
//                         ))}
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//             <div className="relative flex-1">
//             {/* <div className="relative flex-1"> */}
//     <div className="max-h-[450px] overflow-y-auto rounded-md border">
//         <Table>
//             <TableHeader>
//                 <TableRow className="sticky top-0 bg-background z-10">
//                     <TableHead>Profile</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Phone No</TableHead>
//                     <TableHead>Action</TableHead>
//                 </TableRow>
//             </TableHeader>

//             <TableBody>
//                 {contacts.length > 0 ? (
//                     contacts.map((contact) => (
//                         <TableRow key={contact.contactId}>
//                             {/* Profile Image */}
//                             <TableCell>
//                                 {contact.mediaUrl ? (
//                                     <img
//                                         src={contact.mediaUrl}
//                                         alt={contact.name}
//                                         className="w-10 h-10 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
//                                         <span className="text-sm text-white">
//                                             {contact.name?.[0] || "N/A"}
//                                         </span>
//                                     </div>
//                                 )}
//                             </TableCell>

//                             {/* Name */}
//                             <TableCell>{contact.name}</TableCell>

//                             {/* Email */}
//                             <TableCell>{contact.email}</TableCell>

//                             {/* Phone */}
//                             <TableCell>{contact.phone}</TableCell>

//                             {/* Action */}
//                             <TableCell>
//                                 <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
//                                     View
//                                 </button>
//                             </TableCell>
//                         </TableRow>
//                     ))
//                 ) : (
//                     <TableRow>
//                         <TableCell colSpan={5} className="text-center py-5">
//                             No contacts found
//                         </TableCell>
//                     </TableRow>
//                 )}
//             </TableBody>
//         </Table>
//     </div>
// {/* </div> */}

// </div>

//             <Pagination>
//                 <PaginationContent>
//                     <PaginationItem>
//                         <PaginationPrevious
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className={
//                                 currentPage === 1
//                                     ? "pointer-events-none opacity-50"
//                                     : "cursor-pointer"
//                             }
//                         />
//                     </PaginationItem>

//                     {pageNumbers.map((page, index) => (
//                         <PaginationItem key={index}>
//                             {page === "start-ellipsis" ||
//                             page === "end-ellipsis" ? (
//                                 <PaginationEllipsis />
//                             ) : (
//                                 <PaginationLink
//                                     onClick={() =>
//                                         handlePageChange(page as number)
//                                     }
//                                     isActive={currentPage === page}
//                                     className={
//                                         currentPage === page
//                                             ? "bg-blue-500 text-white"
//                                             : "cursor-pointer"
//                                     }
//                                 >
//                                     {page}
//                                 </PaginationLink>
//                             )}
//                         </PaginationItem>
//                     ))}

//                     <PaginationItem>
//                         <PaginationNext
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className={
//                                 currentPage === totalPages
//                                     ? "pointer-events-none opacity-50"
//                                     : "cursor-pointer"
//                             }
//                         />
//                     </PaginationItem>
//                 </PaginationContent>
//             </Pagination>
//         </div>
//     );
// };

// export default PagenationContect;
