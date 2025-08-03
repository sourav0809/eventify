"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { Button } from "@/components/common/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { TIERS } from "@/constant/user";
import { agent } from "@/app/api/agent";
import { TTier } from "@/types/user";
import { supabase } from "@/helpers/supabase";
import { TEvent } from "@/types/event";

interface UpgradeTierDialogProps {
  currentTier: string;
  userId: string;
  setEvents: React.Dispatch<React.SetStateAction<TEvent[]>>;
}

export const UpgradeTierDialog = ({
  currentTier,
  userId,
  setEvents,
}: UpgradeTierDialogProps) => {
  const [selectedTier, setSelectedTier] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const availableTiers = TIERS.filter((tier) => tier !== currentTier);

  const handleUpgrade = async () => {
    if (!selectedTier) {
      toast.warning("Please select a tier to continue.");
      return;
    }

    if (!TIERS.includes(selectedTier as TTier)) {
      toast.error("Invalid tier selected");
      return;
    }

    startTransition(async () => {
      try {
        // upgrading the tier of the user
        await agent.upgradeTier({ userId, tier: selectedTier as TTier });

        // fetching the particular events of that tier
        const allowedTiers = TIERS.slice(
          0,
          TIERS.indexOf(selectedTier as TTier) + 1
        );

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .in("tier", allowedTiers);

        if (error) throw error;

        setEvents(data as TEvent[]);
        setIsOpen(false);
        setSelectedTier(undefined);
        toast.success(`Tier successfully upgraded to ${selectedTier}`);
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center bg-blue-600 text-white h-10 rounded-md px-4 hover:bg-blue-700 cursor-pointer hover:text-white"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade Tier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Your Tier</DialogTitle>
          <DialogDescription>
            Your current tier is{" "}
            <span className="font-semibold">{currentTier}</span>. Select a
            different tier to upgrade or downgrade.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a new tier" />
            </SelectTrigger>
            <SelectContent>
              {availableTiers.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            onClick={handleUpgrade}
            disabled={isPending || !selectedTier}
            className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white h-10 cursor-pointer"
          >
            {isPending ? "Updating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
