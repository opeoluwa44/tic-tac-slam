import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    ...preset,
    maskable: {
      ...preset.maskable,
      resizeOptions: {
        ...preset.maskable.resizeOptions,
        background: "#150d09",
      },
    },
    apple: {
      ...preset.apple,
      resizeOptions: { ...preset.apple.resizeOptions, background: "#150d09" },
    },
  },
  images: ["public/icon.svg"],
});
