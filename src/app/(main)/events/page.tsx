"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BadgeCheck, CalendarDays } from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import { createClient } from "@supabase/supabase-js";
import { Badge } from "@/components/common/ui/badge";

const tierOrder = ["free", "silver", "gold", "platinum"] as const;
type Tier = (typeof tierOrder)[number];

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image_url: string;
  tier: Tier;
};

export default function EventsPage() {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const userTier = user?.publicMetadata?.tier as Tier | undefined;

  console.log(userTier);

  useEffect(() => {
    if (!user) return;

    if (!userTier) {
      router.push("/profile");
      return;
    }

    const fetchEvents = async () => {
      const allowedTiers = tierOrder.slice(0, tierOrder.indexOf(userTier) + 1);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .in("tier", allowedTiers);

      console.log(data);

      if (error) {
        console.error("Failed to fetch events", error);
        return;
      }

      console.log(data);
      setEvents(data as Event[]);
      setLoading(false);
    };

    fetchEvents();
  }, [user, userTier]);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  return (
    <div className="max-w-full px-5 sm:px-10 mx-auto py-2 sm:py-8">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold"> Available Events</h1>
        <p className="text-lg">
          Discover our curated collection of programming courses and workshops
          designed to elevate your skills.
        </p>
      </div>
      <div className="grid gap-x-8 gap-y-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-[21rem] cursor-pointer"
          >
            <Image
              src={event.image_url}
              alt={event.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                  {event.description}
                </p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-auto py-2">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {dayjs(event.event_date).format("MMM D, YYYY")}
                </span>
                <Badge
                  className={`uppercase gap-1 inline-flex items-center ${
                    event.tier === "free"
                      ? "bg-gray-100 text-gray-600"
                      : event.tier === "silver"
                      ? "bg-sky-100 text-sky-800"
                      : event.tier === "gold"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" /> {event.tier}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
