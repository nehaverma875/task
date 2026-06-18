import { Badge } from "@/components/ui/badge";
import { cn, titleCase } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  completed: "border-transparent bg-sky-100 text-sky-800 hover:bg-sky-100",
  planning: "border-transparent bg-amber-100 text-amber-900 hover:bg-amber-100",
  "on-hold": "border-transparent bg-zinc-200 text-zinc-800 hover:bg-zinc-200",
  new: "border-transparent bg-violet-100 text-violet-800 hover:bg-violet-100",
  assigned: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100",
  converted: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  inactive: "border-transparent bg-zinc-200 text-zinc-800 hover:bg-zinc-200"
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("w-fit rounded-md capitalize", statusStyles[value], className)}>
      {titleCase(value)}
    </Badge>
  );
}
