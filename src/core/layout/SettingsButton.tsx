interface SettingsButtonProps {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        backgroundColor: "#ffffff22",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 255, 255, 0.3)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
        e.currentTarget.style.backgroundColor = "#ffffff33";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        e.currentTarget.style.backgroundColor = "#ffffff22";
      }}
      aria-label="Open settings"
    >
      ⚙️
    </button>
  );
}

