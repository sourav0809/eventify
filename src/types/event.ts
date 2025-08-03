import { TTier } from "./user";

export type TEvent = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image_url: string;
  tier: TTier;
};
