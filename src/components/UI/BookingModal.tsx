import { PopupModal } from "react-calendly";
import { useEffect, useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <PopupModal
      url="https://calendly.com/emil-petrosyan-norvan/30min"
      onModalClose={onClose}
      open={isOpen}
      rootElement={document.getElementById("root") || document.body}
      styles={{
        height: '1000px'
      }}
    />
  );
}
