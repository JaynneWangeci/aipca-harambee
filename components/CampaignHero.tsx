"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArchProgress from "@/components/ArchProgress";
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
    <div className="relative w-full max-w-5xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-xs transition-colors mb-3"
      >
        <ArrowLeft size={14} /> Home
      </Link>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl text-cream font-bold leading-tight">
            {title}
          </h1>
          <p className="text-cream/70 text-sm sm:text-base mt-3 max-w-md">
            {description}
          </p>
          <div className="mt-4">
            <ShareButtons />
          </div>
        </div>

        <ArchProgress raised={raised} goal={goal} />
      </div>
    </div>
  );
}
