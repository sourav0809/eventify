"use client";

import { CalendarDays, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/common/ui/badge";
import Image from "next/image";
import dayjs from "dayjs";
import { TEvent } from "@/types/event";

export default function EventCard({ event }: { event: TEvent }) {
  const badgeStyle =
    event.tier === "free"
      ? "bg-gray-100 text-gray-600"
      : event.tier === "silver"
      ? "bg-sky-100 text-sky-800"
      : event.tier === "gold"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-purple-100 text-purple-800";

  return (
    <div className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-[22rem] cursor-pointer">
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
            className={`uppercase gap-1 inline-flex items-center ${badgeStyle}`}
          >
            <BadgeCheck className="w-4 h-4" /> {event.tier}
          </Badge>
        </div>
      </div>
    </div>
  );
}
