import { cn } from "@/lib/utils";

export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", className)} {...props} />
);
