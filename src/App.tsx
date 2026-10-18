import { Navigate, Route, Routes } from "react-router";
import { GameProvider } from "./game/GameProvider";
import { Game } from "./screens/Game";
import { Home } from "./screens/Home";
import { Leaderboard } from "./screens/Leaderboard";
import { Result } from "./screens/Result";
import { MotionConfig } from "motion/react";
import { NewMatch } from "./screens/NewMatch";
import { UpdatePrompt } from "./pwa/UpdatePrompt";
import { AuthProvider } from "./auth/AuthProvider";
import { OnlineStart } from "./screens/OnlineStart";
import { OnlineLobby } from "./screens/OnlineLobby";
import { OnlineGame } from "./screens/OnlineGame";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Game />} />
            <Route path="/result" element={<Result />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/new" element={<NewMatch />} />
            <Route path="/online" element={<OnlineStart />} />
            <Route path="/online/:roomId" element={<OnlineLobby />} />
            <Route path="/online/:roomId/play" element={<OnlineGame />} />
          </Routes>
          <UpdatePrompt />
        </GameProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
