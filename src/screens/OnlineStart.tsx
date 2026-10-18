import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../auth/context";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { createRoom, errorMessage, joinRoom, type Room } from "../online/rooms";
import { gradientText } from "../ui";

const BEST_OF = [3, 5, 7];
const cleanCode = (s: string) =>
  s
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4);

export function OnlineStart() {
  const { enabled, ensureSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [bestOf, setBestOf] = useState(5);
  const [code, setCode] = useState(() => cleanCode(params.get("code") ?? ""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = async (action: () => Promise<Room>) => {
    setBusy(true);
    setError(null);
    try {
      await ensureSession(); // the guest session is created here, only when needed
      const room = await action();
      navigate(`/online/${room.id}`);
    } catch (e) {
      console.error("Online action failed:", e);

      setError(
        errorMessage(e) === "Room not found"
          ? "No open room with that code."
          : "Couldn't do that. Please try again.",
      );
      setBusy(false);
    }
  };

  return (
    <Screen>
      <header>
        <Link
          to="/"
          aria-label="Back to menu"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
      </header>

      <h1 className="mt-7 font-display text-[76px] uppercase leading-[0.92]">
        Play
        <br />
        <span className={gradientText}>online</span>
      </h1>

      {!enabled ? (
        <p className="mt-10 text-muted">
          Online play isn't set up in this build.
        </p>
      ) : (
        <>
          <section className="mt-8">
            <div className="text-[13px] font-bold tracking-[3px] text-muted">
              MATCH LENGTH
            </div>
            <div
              role="radiogroup"
              aria-label="Match length"
              className="mt-2.5 flex gap-2.5"
            >
              {BEST_OF.map((n) => (
                <button
                  key={n}
                  role="radio"
                  aria-checked={bestOf === n}
                  onClick={() => setBestOf(n)}
                  className={`h-11 flex-1 rounded-full text-[15px] font-bold ${
                    bestOf === n
                      ? "bg-linear-to-b from-amber to-ember text-ink"
                      : "border border-white/15 bg-white/5"
                  }`}
                >
                  Best of {n}
                </button>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              disabled={busy}
              onClick={() => go(() => createRoom(bestOf))}
            >
              Create room
            </Button>
          </section>

          <div className="my-6 text-center text-sm text-muted">
            or join a friend
          </div>

          <section className="flex gap-3">
            <input
              value={code}
              onChange={(e) => setCode(cleanCode(e.target.value))}
              aria-label="Room code"
              placeholder="CODE"
              maxLength={4}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="h-16 min-w-0 flex-1 rounded-full border border-white/15 bg-tile text-center font-display text-3xl uppercase tracking-[8px] text-cream placeholder:text-muted/50"
            />
            <Button
              variant="secondary"
              className="px-8"
              disabled={busy || code.length < 4}
              onClick={() => go(() => joinRoom(code))}
            >
              Join
            </Button>
          </section>

          {error && (
            <p role="alert" className="mt-4 text-center text-sm text-ember">
              {error}
            </p>
          )}
        </>
      )}
    </Screen>
  );
}
