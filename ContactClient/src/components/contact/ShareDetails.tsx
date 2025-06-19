import React from "react";
import { toast } from "sonner";
import { Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    // DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import apiStore from "@/api/apiStore";
// import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
interface ContactDetails {
    contactId: string;
    userId: string;
    expire: Date | null;
    otp: number;
    onDelete?: () => void;
}

const ShareDetails: React.FC<ContactDetails> = ({
    contactId,
    userId,
    expire,
    otp,
    onDelete,
}) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareLink = `${baseUrl}/contact/share/${contactId}`;

    const handleCopyOtp = () => {
        navigator.clipboard
            .writeText(otp.toString())
            .then(() => toast.success("OTP copied to clipboard"))
            .catch(() => toast.error("Failed to copy OTP"));
    };

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(shareLink)
            .then(() => toast.success("Link copied to clipboard"))
            .catch(() => toast.error("Failed to copy link"));
    };

    const handleSocialShare = (platform: string) => {
        let url = "";
        const text = `Check this out: ${shareLink}`;

        switch (platform) {
            case "twitter":
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    text
                )}`;
                break;
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareLink
                )}`;
                break;
            case "linkedin":
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareLink
                )}`;
                break;
            case "whatsapp":
                url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                break;
            default:
                return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };

    const formattedExpire = expire
        ? new Date(expire).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZoneName: "short",
          })
        : null;

    const deleteShare = async () => {
        try {
            const response=await apiStore.deleteShareContact(userId, contactId);
            if(response?.status==200){
              onDelete && onDelete(); // Call the onDelete callback if it exists
            }

        } catch (error) {}
        // alert("share link will be delete");
    };
    return (
        <div className="mt-4 p-6 overflow-y-auto bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300 max-w-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-500" />
                Share Details
            </h3>

            <div className="space-y-4 text-sm">
                {/* Share Link Section */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        🔗 Share Link
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {/* Clickable Link Box (copies on click) */}
                        <div
                            onClick={handleCopyLink}
                            className="flex-1 cursor-pointer rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-inner hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Click to copy link"
                        >
                            <a
                                href={shareLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.preventDefault()} // Prevent redirect on click
                                className="text-blue-600 dark:text-blue-400 hover:underline break-words"
                            >
                                {shareLink}
                            </a>
                        </div>

                        {/* Social Share Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="h-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 w-3 h-14"
                                    title="Share to social"
                                >
                                    <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-200" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md py-1"
                            >
                                {[
                                    { label: "Twitter", value: "twitter" },
                                    { label: "Facebook", value: "facebook" },
                                    { label: "LinkedIn", value: "linkedin" },
                                    { label: "WhatsApp", value: "whatsapp" },
                                ].map(({ label, value }) => (
                                    <DropdownMenuItem
                                        key={value}
                                        onClick={() => handleSocialShare(value)}
                                        className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        {label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Expiration Date */}
                {formattedExpire && (
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700 dark:text-gray-300 w-24">
                            Expires
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                            {formattedExpire}
                        </span>
                    </div>
                )}

                {/* OTP Section */}
                <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-700 dark:text-gray-300 w-24">
                        OTP Code
                    </span>
                    <div className="flex items-center gap-2">
                        <div
                            onClick={handleCopyOtp}
                            className="px-3 py-1.5 cursor-pointer bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-md font-mono border border-blue-200 dark:border-blue-800"
                        >
                            {otp}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className="mt-6 w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg px-4 py-2 shadow-md transition-all duration-200 active:scale-95"
                        // onClick={onDelete}
                        aria-label="Delete share link"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Share Link
                    </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl max-w-md p-6 shadow-xl transition-colors duration-300">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white text-center">
                            Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription asChild>
                            <span className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center block">
                                This action cannot be undone. This will
                                permanently delete the share link and remove
                                associated data from our servers.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex justify-center gap-4">
                        <Button
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-200 active:scale-95"
                            onClick={deleteShare}
                            aria-label="Confirm deletion"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Delete Button */}
            {/* {onDelete && ( */}

            {/* <Dialog>
  <ContextMenu>
    <ContextMenuTrigger>Right click</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Open</ContextMenuItem>
      <ContextMenuItem>Download</ContextMenuItem>
      <DialogTrigger asChild>
        <ContextMenuItem>
          <span>Delete</span>
        </ContextMenuItem>
      </DialogTrigger>
    </ContextMenuContent>
  </ContextMenu>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to permanently
        delete this file from our servers?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog> */}
            {/* )} */}
        </div>
    );
};

export default ShareDetails;
