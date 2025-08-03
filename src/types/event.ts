export type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image_url: string;
  tier: "free" | "silver" | "gold" | "platinum";
};
