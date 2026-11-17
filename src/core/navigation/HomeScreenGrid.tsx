import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { loadModuleThemeValues } from "../theme/modulePalettes";
import { moduleLinks } from "./moduleLinks";
import { loadSidebarButtonContent } from "./sidebarButtonContent";
import { setHomescreenCubed } from "./homescreen";
import "./HomeScreenGrid.css";

export default function HomeScreenGrid() {
  const navigate = useNavigate();
  const tiles = useMemo(() => moduleLinks, []);
  const buttonContent = loadSidebarButtonContent();

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
        {tiles.map((tile) => {
          const theme = loadModuleThemeValues(tile.moduleName);
          const style = {
            "--tile-bg": theme.moduleBackgroundGradient,
            "--tile-accent": theme.moduleAccent,
            "--tile-accent-2": theme.moduleAccent2,
          } as CSSProperties;
          return (
            <button
              key={tile.path}
              type="button"
              className="home-grid-tile"
              style={style}
              onClick={() => handleOpen(tile.path)}
            >
              <span className="home-grid-icon">{buttonContent[tile.path]?.icon ?? tile.icon}</span>
              <span className="home-grid-label">{tile.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
