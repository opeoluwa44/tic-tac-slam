import { supabase } from "../lib/supabase";

export type Mark = "X" | "O";

export type Room = {
  id: string;
  code: string;
  host_id: string;
  guest_id: string | null;
  board: string; // nine characters: X, O or "."
  turn: Mark;
  result: Mark | "draw" | null;
  round: number;
  scores_x: number;
  scores_o: number;
  best_of: number;
  status: "waiting" | "playing" | "closed";
  version: number;
};

function client() {
  if (!supabase) throw new Error("Online play is not available in this build");
  return supabase;
}

async function call(fn: string, args?: Record<string, unknown>): Promise<Room> {
  const { data, error } = await client().rpc(fn, args);
  if (error) throw error;
  return data as Room;
}

export const createRoom = (bestOf: number) =>
  call("create_room", { p_best_of: bestOf });
export const joinRoom = (code: string) => call("join_room", { p_code: code });

export async function leaveRoom(roomId: string) {
  const { error } = await client().rpc("leave_room", { p_room: roomId });
  if (error) throw error;
}

export const errorMessage = (e: unknown) =>
  typeof e === "object" && e !== null && "message" in e
    ? String((e as { message: unknown }).message)
    : "Something went wrong";

export const playMove = (roomId: string, index: number) =>
  call("play_move", { p_room: roomId, p_index: index });

export const nextRound = (roomId: string, round: number) =>
  call("next_round", { p_room: roomId, p_round: round });
