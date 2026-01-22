import { cn } from "@/lib/utils";
import { Champion } from "@/types";
import {
  RiCrosshair2Line,
  RiDropLine,
  RiHeartPulseLine,
  RiLoader4Line,
  RiMagicLine,
  RiShieldLine,
  RiSpeedLine,
  RiSwordLine,
} from "@remixicon/react";
import { type ElementType } from "react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export function ChampionCard({ champion }: { champion: Champion }) {
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${champion.version}/img/champion/${champion.image.full}`;

  return (
    <Card className="group hover:border-primary/50 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start gap-3">
          {/* Avatar / Icon */}
          <div className="border-border relative size-14 shrink-0 overflow-hidden rounded-md border shadow-sm">
            <img
              src={imageUrl}
              alt={champion.name}
              className="size-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Title & Tags */}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center justify-between">
              <CardTitle className="truncate text-base font-bold">
                {champion.name}
              </CardTitle>
            </div>
            <CardDescription className="line-clamp-1 text-xs capitalize">
              {champion.title}
            </CardDescription>
            <div className="flex flex-wrap gap-1">
              {champion.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="h-4 rounded-[2px] px-1 py-0 text-[10px] font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator className="bg-border/50" />

      <CardContent className="space-y-3 p-4">
        {/* Info Ratings */}
        <div className="grid grid-cols-4 gap-1">
          <StatBar
            icon={RiSwordLine}
            value={champion.info.attack}
            color="bg-red-500"
            label="ATK"
          />
          <StatBar
            icon={RiShieldLine}
            value={champion.info.defense}
            color="bg-yellow-500"
            label="DEF"
          />
          <StatBar
            icon={RiMagicLine}
            value={champion.info.magic}
            color="bg-blue-500"
            label="MAG"
          />
          <StatBar
            icon={RiLoader4Line} // Using loader as complexity icon
            value={champion.info.difficulty}
            color="bg-purple-500"
            label="DIF"
          />
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <div className="text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RiHeartPulseLine className="size-3" />
              <span>HP</span>
            </div>
            <span className="text-foreground font-mono">
              {champion.stats.hp}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RiDropLine className="size-3" />
              <span>MP</span>
            </div>
            <span className="text-foreground font-mono">
              {champion.stats.mp}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RiCrosshair2Line className="size-3" />
              <span>Range</span>
            </div>
            <span className="text-foreground font-mono">
              {champion.stats.attackrange}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RiSpeedLine className="size-3" />
              <span>Speed</span>
            </div>
            <span className="text-foreground font-mono">
              {champion.stats.movespeed}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBar({
  icon: Icon,
  value,
  color,
  label,
}: {
  icon: ElementType;
  value: number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-muted text-muted-foreground flex size-6 items-center justify-center rounded-sm">
        <Icon className="size-3.5" />
      </div>
      <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full opacity-80", color)}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
