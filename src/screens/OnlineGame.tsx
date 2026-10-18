import { useState } from "react";
import { ChevronLeft, Globe } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useAuth } from "../auth/context";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { ScoreCard } from "../components/ScoreCard";
import { Screen } from "../components/Screen";
import { getWinner } from "../game/logic";
import {
  boardFromString,
  matchWinner,
  newestMark,
  onlineStatus,
} from "../online/convert";
import {
  leaveRoom,
  nextRound,
  playMove,
  type Mark,
  type Room,
} from "../online/rooms";
import { useRoom } from "../online/useRoom";
import { gradientText } from "../ui";

function useNewestMark(board: string) {
  const [prev, setPrev] = useState(board);
  const [newest, setNewest] = useState<number | undefined>();
  if (board !== prev) {
    setPrev(board);
    setNewest(newestMark(prev, board));
  }
  return newest;
}

function Match({
  room,
  me,
  apply,
}: {
  room: Room;
  me: Mark;
  apply: (room: Room) => void;
}) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const board = boardFromString(room.board);
  const winner = getWinner(board);
  const lastMove = useNewestMark(room.board);
  const status = onlineStatus(room, me);
  const roundOver = room.result !== null;
  const champion = matchWinner(room);
  const myTurn = room.turn === me && !roundOver;

  const run = async (action: () => Promise<Room>, failure: string) => {
    setPending(true);
    setProblem(null);
    try {
      apply(await action());
    } catch (e) {
      console.error(e);
      setProblem(failure);
    } finally {
      setPending(false);
    }
  };

  const leave = async () => {
    try {
      await leaveRoom(room.id);
    } finally {
      navigate("/online");
    }
  };

  return (
    <Screen className="gap-5">
      <header className="flex items-center justify-between">
        <button
          aria-label="Leave match"
          onClick={leave}
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-4 text-[15px] font-bold">
          <Globe size={16} className="text-amber" aria-hidden="true" />
          Round {room.round}
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
          <span className="text-muted">Best of {room.best_of}</span>
        </div>
        <div className="size-11" />
      </header>

      <div className="flex gap-3">
        <ScoreCard
          player="X"
          label={me === "X" ? "You" : "Opponent"}
          score={room.scores_x}
          active={!roundOver && room.turn === "X"}
        />
        <ScoreCard
          player="O"
          label={me === "O" ? "You" : "Opponent"}
          score={room.scores_o}
          active={!roundOver && room.turn === "O"}
        />
      </div>

      <h2 className="flex h-14 items-center justify-center whitespace-nowrap font-display text-[52px] uppercase leading-none">
        {status.lead && <>{status.lead}&nbsp;</>}
        <span className={gradientText}>{status.accent}</span>
      </h2>

      <Board
        board={board}
        winLine={winner?.line}
        lastMove={lastMove}
        disabled={!myTurn || pending}
        onPlay={(index) =>
          run(
            () => playMove(room.id, index),
            "That move didn't go through. Try again.",
          )
        }
      />

      <p role="alert" className="h-5 text-center text-sm text-ember">
        {problem}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        {champion ? (
          <>
            <p className="text-center font-display text-3xl uppercase">
              <span className={gradientText}>
                {champion === me ? "You won the match" : "Friend won the match"}
              </span>
            </p>
            <Button onClick={leave}>Back to menu</Button>
          </>
        ) : roundOver ? (
          <Button
            disabled={pending}
            onClick={() =>
              run(
                () => nextRound(room.id, room.round),
                "Couldn't start the next round.",
              )
            }
          >
            Next round
          </Button>
        ) : (
          <Button variant="secondary" onClick={leave}>
            Leave match
          </Button>
        )}
      </div>
    </Screen>
  );
}

export function OnlineGame() {
  const { roomId } = useParams();
  const { user, loading } = useAuth();
  const { room, error, apply } = useRoom(roomId);

  if (!loading && !user) return <Navigate to="/online" replace />;

  const note = (text: string) => (
    <Screen>
      <header>
        <Link
          to="/online"
          aria-label="Back"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
      </header>
      <p className="mt-16 text-center text-muted">{text}</p>
    </Screen>
  );

  if (error) return note(error);
  if (!room || !user) return note("Loading match...");
  if (user.id !== room.host_id && user.id !== room.guest_id)
    return <Navigate to="/online" replace />;
  if (room.status === "waiting")
    return <Navigate to={`/online/${room.id}`} replace />;
  if (room.status === "closed")
    return note("Your friend left, or the room closed.");

  return (
    <Match
      room={room}
      me={user.id === room.host_id ? "X" : "O"}
      apply={apply}
    />
  );
}
