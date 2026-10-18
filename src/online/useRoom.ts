import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Room } from "./rooms";

const newer = (current: Room | null, incoming: Room): Room =>
  current && current.version >= incoming.version ? current : incoming;

export function useRoom(roomId: string | undefined) {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !roomId) return;
    const client = supabase;
    let active = true;

    const channel = client
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (active) setRoom((cur) => newer(cur, payload.new as Room));
        },
      )
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        const { data, error } = await client
          .from("rooms")
          .select("*")
          .eq("id", roomId)
          .single();
        if (!active) return;
        if (error) setError("Couldn't load this room.");
        else setRoom((cur) => newer(cur, data as Room));
      });

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, [roomId]);

  const apply = useCallback(
    (incoming: Room) => setRoom((cur) => newer(cur, incoming)),
    [],
  );

  return { room, error, apply };
}
