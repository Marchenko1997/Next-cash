import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <Skeleton className="h-[200px] w-full bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse mt-4" />
  );
};

export default Loading;
