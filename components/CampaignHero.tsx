"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NobukProgress from "@/components/NobukProgress";
import ShareButtons from "@/components/ShareButtons";

interface CampaignHeroProps {
  title: string;
  description: string;
  raised: number;
  goal: number;
}

export default function CampaignHero({
  title,
  description,
  raised,
  goal,
}: CampaignHeroProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-6 pb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-maroon/40 hover:text-maroon text-xs transition-colors mb-4"
      >
        <ArrowLeft size={13} /> Back to home
      </Link>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-maroon leading-tight">
            {title}
          </h1>
          <p className="text-maroon/60 text-sm mt-1.5 max-w-xl">
            {description}
          </p>
        </div>

        <NobukProgress raised={raised} goal={goal} />

        <ShareButtons />
      </div>
    </div>
  );
}
