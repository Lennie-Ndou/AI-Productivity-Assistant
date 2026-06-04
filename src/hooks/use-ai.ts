import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { runAi } from "@/lib/ai.functions";

type Feature = "email" | "meeting" | "tasks" | "research" | "chat";

export function useAi(feature: Feature) {
  const fn = useServerFn(runAi);
  return useMutation({
    mutationFn: async (messages: Array<{ role: "user" | "assistant"; content: string }>) => {
      const res = await fn({ data: { feature, messages } });
      if (!res.ok) throw new Error(res.error);
      return res.content;
    },
  });
}