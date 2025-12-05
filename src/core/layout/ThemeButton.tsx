import { useState, useRef } from "react";

interface ThemeButtonProps {
  onColorChange: (color: string) => void;
}

export default function ThemeButton({ onColorChange }: ThemeButtonProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    colorInputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onColorChange(color);
    setIsPickerOpen(false);
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          position: "absolute",
          top: "16px",
          right: "16px",
          backgroundColor: "#ffffff22",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 255, 255, 0.3)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }}
        aria-label="Change theme color"
      />
      <input
        ref={colorInputRef}
        type="color"
        onChange={handleColorChange}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

