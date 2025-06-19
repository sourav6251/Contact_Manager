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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Send, Share2Icon, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UUID } from "crypto";
import ShareDetails from "./ShareDetails";
interface Contact {
  contactId: any;
  email: string;
  mediaId: string;
  mediaUrl: string;
  name: string;
  phone: string;
  share: boolean;
  shareOTP: number
  shareExpire: Date | null;
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
  const userID:any = useSelector((state: RootState) => state.user.userID);
  const userName = useSelector((state: RootState) => state.user.userName);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [days,setDays]=useState(1);
  const [shareLoading,setShareLoading]=useState(false)
  const [contactDetails, setContactDetails] = useState<ContactFormData>({
    id: null,
    file: null,
    name: "",
    email: "",
    phone: "",
  });
  const [isVerified, setIsVerified] = useState(false);

  const contactpage = async () => {
    try {
      const response = await apiStore.contactpage(
        userID,
        query,
        currentPage,
        totalItem
      );
      setTotalPages(response.data.totalPages || 0);
      setContacts(response.data.data || []);
      toast.success("Contacts loaded successfully");
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    }
  };

  const checkIsVerified = async () => {
    try {
      const response = await apiStore.isVerifiedUser(userID);
      setIsVerified(response);
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };

  useEffect(() => {
    checkIsVerified();
    contactpage();
  }, [userID, totalItem, currentPage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      contactpage();
    }, 2000);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setContactDetails((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setContactDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactDetails.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!contactDetails.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (contactDetails.email && !/\S+@\S+\.\S+/.test(contactDetails.email)) {
      toast.error("Invalid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiStore.saveContact(contactDetails, userID);
      toast.success("Contact added successfully");
      setContactDetails({ id: null, file: null, name: "", email: "", phone: "" });
      setPreviewImage(null);
      contactpage();
    } catch (error) {
      toast.error("Failed to add contact");
      console.error("Error saving contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const updateContact = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactDetails.id) return;
    if (!contactDetails.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!contactDetails.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (contactDetails.email && !/\S+@\S+\.\S+/.test(contactDetails.email)) {
      toast.error("Invalid email address");
      return;
    }

    setIsUpdating(true);
    try {
      await apiStore.updateContact(contactDetails.id, contactDetails, userID);
      toast.success("Contact updated successfully");
      contactpage();
      setContactDetails({ id: null, file: null, name: "", email: "", phone: "" });
      setPreviewImage(null);
    } catch (error) {
      console.error("Failed to update contact:", error);
      toast.error("Failed to update contact");
    } finally {
      setIsUpdating(false);
    }
  };

  const initializeFormData = (contact: Contact) => {
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

  const activateShareContact=async(contactId:string)=>{
    if(days<1 ||days>30){
      toast.info("Days must be between 1 to 30")
    }
    setShareLoading(true)
   const response= await apiStore.activateShareContact(userID,contactId,days)
   if (response?.status===200) {
    contactpage()
   }
   setShareLoading(false)
  }
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="w-full mt-12 rounded-xl ">
      <div className="flex flex-col gap-4 mx-6">
        <div className="flex items-center justify-between">


        <Dialog>
            <DialogTrigger asChild>
              <Button
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 shadow-md transition-all duration-200 active:scale-95"
                disabled={!isVerified}
                aria-label="Add new contact"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 rounded-xl max-w-md transition-colors duration-300">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-semibold text-gray-800 dark:text-white">
                  Hi {userName}, Add Your Contact
                </DialogTitle>
                <DialogDescription asChild>
                  <span className="mt-6 space-y-6 block">
                    <form onSubmit={handleSubmit}>
                      <span className="relative w-28 h-28 mx-auto block">
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
                          aria-label="Upload profile image"
                        />
                        <span className="absolute top-0 left-0 w-28 h-28 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center z-5 text-xs text-gray-600 dark:text-gray-300 pointer-events-none">
                          Upload
                        </span>
                      </span>

                      <span className="block">
                        <Label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={contactDetails.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                          required
                          aria-required="true"
                        />
                      </span>

                      <span className="block">
                        <Label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={contactDetails.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                        />
                      </span>

                      <span className="block">
                        <Label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Phone No.
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="123-456-7890"
                          value={contactDetails.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                          required
                          aria-required="true"
                        />
                      </span>

                      <span className="pt-4 text-center block">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg shadow-md transition-all duration-200 active:scale-95 ${
                            isSubmitting
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                          }`}
                          aria-label="Submit contact form"
                        >
                          {isSubmitting ? (
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
                        </Button>
                      </span>
                    </form>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-4 w-1/3 ">
          <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="focus:border-none w-[70%] rounded-3xl p-3 bg-white/90 dark:bg-gray-700/90 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-200 border border-gray-300 dark:border-gray-600 transition-colors duration-300"
              placeholder="Search ..."
              aria-label="Search contacts"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                className="border-[1px] border-gray-300 dark:border-gray-600 rounded-2xl w-16 bg-white/90 dark:bg-gray-700/90 text-black dark:text-white shadow-sm"
                aria-label="Select items per page"
              >
                {totalItem}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md text-black dark:text-white">
                <DropdownMenuLabel className="text-black dark:text-white">
                  Items per page
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[10, 20, 30, 40, 50].map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => {
                      setTotalItem(item);
                      setCurrentPage(1);
                    }}
                    className="text-black dark:text-white focus:bg-gray-200/50 dark:focus:bg-gray-600/50 cursor-pointer"
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            
          </div>
        </div>

        <div className="relative contact-table-container">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 bg-gradient-to-tr from-[#66A6FF] to-[#89F7FE] dark:from-[#00B4D8] dark:to-[#0077B6] z-10">
              <TableRow>
                {["Profile Photo", "Name", "Email", "Phone No.", "Action"].map(
                  (heading, i) => (
                    <TableHead
                      key={i}
                      className={`text-center text-white font-medium ${
                        i === 0
                          ? "w-[100px]"
                          : i === 1
                          ? "w-[150px]"
                          : i === 2
                          ? "w-[200px]"
                          : "w-[120px]"
                      }`}
                    >
                      {heading}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white/80 dark:bg-gray-800/80">
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
                    className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell className="text-center text-black dark:text-white">
                      {contact.mediaUrl ? (
                        <img
                          src={contact.mediaUrl}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full mx-auto object-cover"
                        />
                      ) : (
                        <span className="w-10 h-10 rounded-full mx-auto shadow-md bg-white dark:bg-gray-600 inline-block" />
                      )}
                    </TableCell>
                    <TableCell className="text-center text-black dark:text-white truncate">
                      {contact.name}
                    </TableCell>
                    <TableCell className="text-center text-black dark:text-white truncate">
                      {contact.email}
                    </TableCell>
                    <TableCell className="text-center text-black dark:text-white truncate">
                      {contact.phone}
                    </TableCell>
                    <TableCell className="text-center flex justify-center gap-2">
                      {/* Delete Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/50"
                            aria-label={`Delete contact ${contact.name}`}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl">
                          <DialogHeader>
                            <DialogTitle className="text-black dark:text-white">
                              Are you absolutely sure?
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-200">
                              <span className="block">
                                This action cannot be undone. This will
                                permanently delete the contact.
                              </span>
                              <span className="pt-4  justify-center gap-4 block">
                                <Button
                                  variant="outline"
                                  className="text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                  aria-label="Cancel deletion"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                                  onClick={() => deleteContact(contact.contactId)}
                                  disabled={isDeleting}
                                  aria-label="Confirm deletion"
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      {/* Edit Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/50"
                            onClick={() => initializeFormData(contact)}
                            aria-label={`Edit contact ${contact.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-black dark:text-white">
                              Edit Contact
                            </DialogTitle>
                            <DialogDescription asChild>
                              <span className="mt-6 space-y-6 block">
                                <form onSubmit={updateContact}>
                                  <span className="relative w-28 h-28 mx-auto block">
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
                                          alt="Contact"
                                          className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border border-gray-400 shadow-md z-0"
                                        />
                                      )
                                    )}
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="absolute top-0 left-0 w-28 h-28 rounded-full opacity-0 z-10 cursor-pointer"
                                      aria-label="Upload new profile image"
                                    />
                                    <span className="absolute top-0 left-0 w-28 h-28 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center z-5 text-xs text-gray-600 dark:text-gray-300 pointer-events-none">
                                      Upload
                                    </span>
                                  </span>

                                  <span className="block">
                                    <Label
                                      htmlFor="name"
                                      className="text-sm text-gray-700 dark:text-white"
                                    >
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      type="text"
                                      value={contactDetails.name}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                      required
                                      aria-required="true"
                                    />
                                  </span>

                                  <span className="block">
                                    <Label
                                      htmlFor="email"
                                      className="text-sm text-gray-700 dark:text-white"
                                    >
                                      Email
                                    </Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={contactDetails.email}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                    />
                                  </span>

                                  <span className="block">
                                    <Label
                                      htmlFor="phone"
                                      className="text-sm text-gray-700 dark:text-white"
                                    >
                                      Phone No.
                                    </Label>
                                    <Input
                                      id="phone"
                                      type="tel"
                                      disabled
                                      value={contactDetails.phone}
                                      onChange={handleInputChange}
                                      className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                      required
                                      aria-required="true"
                                    />
                                  </span>

                                  <span className="pt-4 text-center block">
                                    <Button
                                      type="submit"
                                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 shadow-md transition-all duration-200 active:scale-95"
                                      disabled={isUpdating}
                                      aria-label="Update contact"
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
                                  </span>
                                </form>
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      {/* View Button */}
                      <Sheet >
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                            aria-label={`View contact ${contact.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent  className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-0">
                          <SheetHeader >
                            <SheetTitle className="text-black dark:text-white">
                              Contact Details
                            </SheetTitle>
                            <SheetDescription asChild>
                              <div className="mt-6 space-y-4 block">
                                <div className="flex justify-center">
                                  {contact.mediaUrl ? (
                                    <img
                                      src={contact.mediaUrl}
                                      alt={contact.name}
                                      className="w-24 h-24 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 inline-block" />
                                  )}
                                </div>
                                <div className="block">
                                  <div
                                    role="heading"
                                    aria-level={3}
                                    className="text-lg font-medium text-center text-black dark:text-white"
                                  >
                                    {contact.name}
                                  </div>
                                </div>
                                <div className="space-y-2 block">
                                  <div className="block">
                                    <Label className="text-gray-600 dark:text-gray-400">
                                      Email
                                    </Label>
                                    <div className="text-black dark:text-white block">
                                      {contact.email || "N/A"}
                                    </div>
                                  </div>
                                  <div className="block">
                                    <Label className="text-gray-600 dark:text-gray-400">
                                      Phone
                                    </Label>
                                    <div className="text-black dark:text-white block">
                                      {contact.phone}
                                    </div>
                                  </div>
                                </div>
                           
                                {/* <Button onClick={()=>{console.log(`hello${contact.share}`);
                                }}>hi</Button> */}
                                {contact.share ? <ShareDetails
                                contactId={contact.contactId}
                                userId={userID}
                                expire={contact.shareExpire}
                                otp={contact.shareOTP}
                                onDelete={contactpage}
                                /> :
                                <Dialog >
                                  <DialogTrigger   asChild   className="w-full">
                                    <Button className="h-10 w-[90%] bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2 rounded-lg shadow-md">
                                      Share
                                      <Share2Icon className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent   className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-[25rem] p-6">
                                    <DialogHeader  >
                                      <DialogTitle className="text-xl font-semibold text-center">
                                        Set Expiration for Share Link
                                      </DialogTitle>
                                      <DialogDescription asChild  className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
                                       <div>
                                        <Label className="block mb-2 text-left text-sm font-medium">
                                          Enter number of days after which the link will expire:
                                        </Label>
                                        <Input
                                          type="number"
                                          min={1}
                                          max={30}
                                          placeholder="Days (1-30)"
                                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                          aria-label="Expiration days"
                                          value={days}
                                          onChange={(e)=>{setDays(Number(e.target.value))}}
                                        />

                                        <div className="flex flex-col gap-3 mt-6">
                                          <Button asChild
                                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white w-full rounded-lg px-4 py-2 transition-all duration-200"
                                            onClick={()=>activateShareContact(contact.contactId)}
                                            disabled={shareLoading}
                                          >
                                            {shareLoading ?<img src="Loading.svg" alt="loading" />:<div>
                                              Share <Share2Icon className="ml-2 w-4 h-4" /></div>}
                                          </Button>

                                        </div>
                                        </div>
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>}
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
                    className="text-center py-5 text-black dark:text-white"
                  >
                    No contacts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination className="pb-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer bg-white/90 dark:bg-gray-700/90 text-black dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-600/50 rounded-md"
                }
                aria-label="Previous page"
              />
            </PaginationItem>

            {pageNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {page === "start-ellipsis" || page === "end-ellipsis" ? (
                  <PaginationEllipsis className="text-gray-800 dark:text-white" />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={currentPage === page}
                    className={
                      currentPage === page
                        ? "bg-blue-600 text-white dark:bg-blue-500 rounded-md"
                        : "cursor-pointer bg-white/90 dark:bg-gray-700/90 text-black dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-600/50 rounded-md"
                    }
                    aria-label={`Page ${page}`}
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
                    : "cursor-pointer bg-white/90 dark:bg-gray-700/90 text-black dark:text-white hover:bg-gray-200/50 dark:hover:bg-gray-600/50 rounded-md"
                }
                aria-label="Next page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PagenationContect;