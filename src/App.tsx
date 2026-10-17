import { Navigate, Route, Routes } from "react-router";
import { GameProvider } from "./game/GameProvider";
import { Game } from "./screens/Game";
import { Home } from "./screens/Home";
import { Leaderboard } from "./screens/Leaderboard";
import { Result } from "./screens/Result";
import { Soon } from "./screens/Soon";
import { MotionConfig } from "motion/react";
import { NewMatch } from "./screens/NewMatch";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Game />} />
          <Route path="/result" element={<Result />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/online" element={<Soon title="Play online" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/new" element={<NewMatch />} />
        </Routes>
      </GameProvider>
    </MotionConfig>
  );
}
