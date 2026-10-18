import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useAuth } from "../auth/context";
import { Button } from "../components/Button";
import { Pill } from "../components/Pill";
import { Screen } from "../components/Screen";
import { SlamMark } from "../components/SlamMark";
import { leaveRoom } from "../online/rooms";
import { useRoom } from "../online/useRoom";
import { gradientText } from "../ui";

export function OnlineLobby() {
  const { roomId } = useParams();
  const { user, loading } = useAuth();
  const { room, error } = useRoom(roomId);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const ready = room?.status === "playing";
  useEffect(() => {
    if (!ready || !roomId) return;
    // Linger a moment so both players see "Friend joined".
    const id = setTimeout(
      () => navigate(`/online/${roomId}/play`, { replace: true }),
      1200,
    );
    return () => clearTimeout(id);
  }, [ready, roomId, navigate]);

  if (!loading && !user) return <Navigate to="/online" replace />;

  const back = (
    <header>
      <Link
        to="/online"
        aria-label="Back"
        className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
      >
        <ChevronLeft size={20} />
      </Link>
    </header>
  );
  const note = (text: string) => (
    <Screen>
      {back}
      <p className="mt-16 text-center text-muted">{text}</p>
    </Screen>
  );

  if (error) return note(error);
  if (!room || !user) return note("Loading room...");
  if (user.id !== room.host_id && user.id !== room.guest_id)
    return <Navigate to="/online" replace />;
  if (room.status === "closed") return note("This room has closed.");

  const isHost = user.id === room.host_id;
  const myMark = isHost ? "X" : "O";
  const friendMark = isHost ? "O" : "X";
  const friendHere = room.guest_id !== null;
  const link = `${window.location.origin}/online?code=${room.code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard can be blocked; the code is on screen anyway */
    }
  };

  const share = async () => {
    const data = {
      title: "Tic Tac Vinyl",
      text: `Join my game with code ${room.code}`,
      url: link,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(link);
    } catch {
      /* the person cancelled the share sheet */
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
    <Screen>
      {back}

      <h1 className="mt-7 font-display text-[64px] uppercase leading-[0.95]">
        {friendHere ? (
          <>
            Friend <span className={gradientText}>joined</span>
          </>
        ) : (
          <>
            Waiting <span className={gradientText}>for a friend</span>
          </>
        )}
      </h1>
      <p className="mt-2 text-muted">Best of {room.best_of}</p>

      {!friendHere && (
        <section className="mt-6 rounded-[28px] border border-white/10 bg-tile px-5 py-5">
          <div className="text-[13px] font-bold tracking-[3px] text-muted">
            ROOM CODE
          </div>
          <div
            className={`font-display text-[68px] leading-[1.1] tracking-[10px] ${gradientText}`}
          >
            {room.code}
          </div>
          <div className="mt-2.5 flex gap-2.5">
            <Pill className="flex-1 justify-center" onClick={copy}>
              {copied ? "Copied" : "Copy code"}
            </Pill>
            <Pill className="flex-1 justify-center" onClick={share}>
              Share link
            </Pill>
          </div>
        </section>
      )}

      <section className="mt-6 flex flex-col gap-2.5">
        <div className="flex items-center gap-3.5 rounded-[22px] border-[1.5px] border-ember bg-tile px-4 py-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-ink">
            <SlamMark player={myMark} size={28} />
          </div>
          <div className="flex-1">
            <div className="font-bold">You</div>
            <div className="text-[13px] text-muted">
              {isHost ? "Host" : "Guest"} · plays {myMark}
            </div>
          </div>
        </div>

        {friendHere ? (
          <div className="flex items-center gap-3.5 rounded-[22px] border border-white/10 bg-tile px-4 py-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-ink">
              <SlamMark player={friendMark} size={28} />
            </div>
            <div className="flex-1">
              <div className="font-bold">Friend</div>
              <div className="text-[13px] text-muted">
                {isHost ? "Guest" : "Host"} · plays {friendMark}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 rounded-[22px] border-[1.5px] border-dashed border-white/20 px-4 py-3">
            <motion.div
              className="vinyl-grooves flex size-11 items-center justify-center rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 2.4 }}
            >
              <div className="size-4 rounded-full bg-linear-to-br from-amber to-ember" />
            </motion.div>
            <div className="font-medium text-muted">
              Waiting for a friend...
            </div>
          </div>
        )}
      </section>

      {friendHere && (
        <p className="mt-6 text-center text-sm text-muted">
          Starting the match...
        </p>
      )}

      <div className="mt-auto pt-8">
        <Button variant="secondary" className="w-full" onClick={leave}>
          Leave room
        </Button>
      </div>
    </Screen>
  );
}
