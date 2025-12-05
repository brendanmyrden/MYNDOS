import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "MYND OS", path: "/myndos" },
  { name: "Sanctuary", path: "/sanctuary" },
  { name: "Task Pill", path: "/taskpill" },
  { name: "R-A-P-H [ i ]", path: "/raphi" },
  { name: "MYRRYR", path: "/myrryr" },
  { name: "SYYR", path: "/syyr" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div style={styles.sidebar}>
      {links.map((l) => (
        <Link
          key={l.path}
          to={l.path}
          style={{
            ...styles.link,
            background:
              location.pathname === l.path ? "#0D1117" : "transparent",
          }}
        >
          {l.name}
        </Link>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    background: "#06090F",
    padding: "20px",
    borderRight: "1px solid #111",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  link: {
    color: "#EDEDED",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: "8px",
    transition: "0.2s",
  },
};