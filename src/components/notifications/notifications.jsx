import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const SuccessMessage = ({ message = "Gelukt!", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      <CheckCircle size={24} />
      <span>{message}</span>
    </div>
  );
};

export default SuccessMessage;
