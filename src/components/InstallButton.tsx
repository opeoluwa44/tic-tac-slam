import { useState } from "react";
import { Download, Share } from "lucide-react";
import { useInstall } from "../pwa/useInstall";

export function InstallButton() {
  const { mode, install } = useInstall();
  const [open, setOpen] = useState(false);

  if (mode === "installed" || mode === "none") return null;

  const isIos = mode === "ios";

  return (
    <div className="relative">
      <button
        aria-label={isIos ? "Add to Home Screen" : "Install app"}
        aria-expanded={isIos ? open : undefined}
        aria-controls={isIos ? "ios-install-help" : undefined}
        onClick={isIos ? () => setOpen((o) => !o) : install}
        className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
      >
        <Download size={20} className="text-amber" aria-hidden="true" />
      </button>

      {isIos && open && (
        <div
          id="ios-install-help"
          className="absolute right-0 top-14 z-20 w-64 rounded-2xl border border-white/15 bg-tile p-4 text-sm leading-relaxed shadow-lg"
        >
          <p className="font-bold">Add to Home Screen</p>
          <p className="mt-1 text-muted">
            Tap{" "}
            <Share size={14} className="-mt-0.5 inline" aria-label="Share" /> in
            Safari, then choose <b className="text-cream">Add to Home Screen</b>
            .
          </p>
          <button
            onClick={() => setOpen(false)}
            className="mt-3 font-bold text-amber"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
