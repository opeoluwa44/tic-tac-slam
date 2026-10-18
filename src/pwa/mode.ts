export type InstallMode = "installed" | "prompt" | "ios" | "none";

type Inputs = { installed: boolean; canPrompt: boolean; ios: boolean };

export const getInstallMode = ({
  installed,
  canPrompt,
  ios,
}: Inputs): InstallMode =>
  installed ? "installed" : canPrompt ? "prompt" : ios ? "ios" : "none";
