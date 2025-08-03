"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { TTier } from "@/types/user";
import { TIERS } from "@/constant/user";
import { supabase } from "@/helpers/supabase";
import { TEvent } from "@/types/event";
import EventCard from "@/components/event/EventCard";
import { EventLoader } from "@/components/event/EventLoader";
import { pathNames } from "@/constant/pathname.const";
import { toast } from "sonner";

export default function EventsPage() {
  const { user } = useUser();
  const [events, setEvents] = useState<TEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userTier = user?.publicMetadata?.tier as TTier | undefined;

  useEffect(() => {
    if (!user) return;

    if (!userTier) {
      router.push(pathNames.profile);
      return;
    }

    (async () => {
      try {
        const allowedTiers = TIERS.slice(0, TIERS.indexOf(userTier) + 1);

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .in("tier", allowedTiers);

        if (error) throw error;

        setEvents(data as TEvent[]);
      } catch (err) {
        console.error("Failed to fetch events", err);
        toast.error("Something went wrong while fetching events.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, userTier]);

  return (
    <div className=" w-full sm:w-[calc(100vw-6rem)] px-5 sm:px-10 py-2 sm:py-8 overflow-y-hidden">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold"> Available Events</h1>
        <p className="text-lg">
          Discover our curated collection of programming courses and workshops
          designed to elevate your skills.
        </p>
      </div>
      <div className="grid gap-x-8 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading && <EventLoader />}
        {!loading &&
          events.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
