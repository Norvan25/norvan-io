import { PopupModal } from "react-calendly";
import { useEffect, useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <PopupModal
      url="https://calendly.com/emil-petrosyan-norvan/30min"
      onModalClose={onClose}
      open={isOpen}
      rootElement={document.body}
      styles={{
        overflow: "hidden",
      }}
      prefill={{
        email: '',
        firstName: '',
        lastName: '',
        name: '',
      }}
    />
  );
}
