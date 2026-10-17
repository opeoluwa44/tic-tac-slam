import { Link } from "react-router";

export function Soon({ title }: { title: string }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-6xl uppercase">{title}</h1>
      <p className="text-muted">Coming soon.</p>
      <Link to="/" className="font-bold text-amber">
        Back to menu
      </Link>
    </main>
  );
}
