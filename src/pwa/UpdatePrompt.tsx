import { useRegisterSW } from "virtual:pwa-register/react";

const HOUR_MS = 60 * 60 * 1000;

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // An installed app can stay open for days. Check for updates hourly.
      if (registration) setInterval(() => registration.update(), HOUR_MS);
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[398px] items-center gap-3 rounded-full border border-ember bg-tile px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg"
    >
      <span className="flex-1 text-sm">A new version is ready.</span>
      <button
        onClick={() => setNeedRefresh(false)}
        className="text-sm text-muted"
      >
        Later
      </button>
      <button
        onClick={() => updateServiceWorker(true)}
        className="text-sm font-bold text-amber"
      >
        Reload
      </button>
    </div>
  );
}
