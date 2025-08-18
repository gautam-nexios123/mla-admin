import { Button } from "@mui/base";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
    Dialog,
    DialogContent,
    Divider
} from "@mui/material";
import { useState } from "react";

export function ShareDialog({
  open,
  onClose,
  shareLink,
  title = "Watch Quotation",
}: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const shareOptions = [
    {
      name: copied ? "Copied!" : "Copy Link",
      icon: copied ? CheckIcon : ContentCopyIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      onClick: handleCopy,
    },
    {
      name: "Mail",
      icon: EmailIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-400",
      onClick: () => {
        const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareLink)}`;
        window.open(mailUrl);
      },
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      onClick: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        window.open(facebookUrl, "_blank");
      },
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      color: "text-gray-900",
      bgColor: "bg-gray-900",
      onClick: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(title)}`;
        window.open(twitterUrl, "_blank");
      },
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      color: "text-green-500",
      bgColor: "bg-green-500",
      onClick: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareLink}`)}`;
        window.open(whatsappUrl, "_blank");
      },
    },
    {
      name: "Gmail",
      icon: EmailIcon,
      color: "text-red-500",
      bgColor: "bg-red-500",
      onClick: () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(title)}&body=${encodeURIComponent(shareLink)}`;
        window.open(gmailUrl, "_blank");
      },
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      color: "text-blue-700",
      bgColor: "bg-blue-700",
      onClick: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
        window.open(linkedinUrl, "_blank");
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent className="bg-gray-800 border-t border-gray-700 text-white">
        <div className="text-white text-center font-600 text-[16px] pb-[4px]">
          Share
        </div>
        <div className="text-white text-center text-[12px] pb-[18px]">
          Watch Quotation
        </div>

        <Divider />

        <div className="pb-6">
          {/* <div className="text-center my-[25px]">
            <p className="text-blue-400 font-medium mb-[10px]">
              No contacts? No problem.
            </p>
            <p className="text-gray-300 text-sm">
              Tap to start sharing this quotation with your network.
            </p>
          </div> */}

          {/* <Divider /> */}

          <div className="grid grid-cols-4 gap-[15px] pt-[25px]">
            {shareOptions.map((option, index) => (
              <div key={index} className="flex flex-col items-center">
                <Button
                  onClick={option.onClick}
                  className={`w-[35px] h-[35px] ${option.bgColor} hover:opacity-80 rounded-lg p-0`}
                  // variant="contained"
                >
                  <option.icon className="text-white !text-[20px]" />
                </Button>
                <span className="text-xs text-gray-300 text-center mt-1">
                  {option.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}