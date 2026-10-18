import { useSyncExternalStore } from "react";
import { getInstallMode } from "./mode";
import {
  getDeferred,
  getInstalled,
  isIos,
  promptInstall,
  subscribe,
} from "./installStore";

export function useInstall() {
  const deferred = useSyncExternalStore(subscribe, getDeferred);
  const installed = useSyncExternalStore(subscribe, getInstalled);
  return {
    mode: getInstallMode({
      installed,
      canPrompt: deferred !== null,
      ios: isIos(),
    }),
    install: promptInstall,
  };
}
