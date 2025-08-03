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
import { UpgradeTierDialog } from "@/components/dialog/UpgraderTierDialog";
import Loader from "@/components/common/ui/loader";

export default function EventsPage() {
  const { user, isLoaded } = useUser();
  const [events, setEvents] = useState<TEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userTier = user?.publicMetadata?.tier as TTier | undefined;

  useEffect(() => {
    if (!user || !userTier || !user?.id) return;

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

  if (!isLoaded || !user) {
    return (
      <div className="w-[calc(100vw-6rem] h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className=" w-full sm:w-[calc(100vw-6rem)] px-5 sm:px-10 py-2 sm:py-8 overflow-y-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold"> Available Events</h1>
          <p className="text-sm sm:text-lg">
            Discover our curated collection of programming courses and workshops
            designed to elevate your skills.
          </p>
        </div>
        <UpgradeTierDialog
          currentTier={userTier as TTier}
          userId={user?.id as any}
          setEvents={setEvents}
        />
      </div>
      <div className="grid gap-x-8 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 sm:mt-5">
        {loading && <EventLoader />}
        {!loading &&
          events.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
