import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { moduleLinks } from "./moduleLinks";
import { setHomescreenCubed } from "./homescreen";
import "./HomeScreenGrid.css";

export default function HomeScreenGrid() {
  const navigate = useNavigate();
  const tiles = useMemo(() => moduleLinks, []);

  const handleOpen = (path: string) => {
    setHomescreenCubed(false);
    navigate(path);
  };

  return (
    <div className="home-grid-shell">
      <div className="home-grid-header">
        <div>
          <div className="home-grid-title">MYND OS</div>
          <div className="home-grid-subtitle">homescreen cubed</div>
        </div>
        <button
          type="button"
          className="home-grid-exit"
          onClick={() => setHomescreenCubed(false)}
        >
          Exit
        </button>
      </div>

      <div className="home-grid">
        {tiles.map((tile) => (
          <button
            key={tile.path}
            type="button"
            className="home-grid-tile"
            onClick={() => handleOpen(tile.path)}
          >
            <span className="home-grid-icon">{tile.icon}</span>
            <span className="home-grid-label">{tile.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
