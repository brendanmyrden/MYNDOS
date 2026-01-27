export interface StrategyStream {
  id: string;
  title: string;
  focus?: string;
  status?: "active" | "paused" | "archived";
  createdAt: Date;
  tags?: string[];
}
