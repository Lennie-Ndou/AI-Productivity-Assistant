import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Sparkles } from "lucide-react";
import { useState } from "react";

import { AiDisclaimer, AiOutput } from "@/components/ai-output";
import { FeaturePage } from "@/components/feature-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/hooks/use-ai";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — WorkPilot AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const ai = useAi("tasks");

  const onGenerate = () => {
    if (!tasks.trim()) return;
    ai.mutate([{ role: "user", content: `Plan and prioritize the following tasks for me:\n\n${tasks}` }]);
  };

  return (
    <FeaturePage
      icon={ListChecks}
      title="AI Task Planner"
      description="List your tasks. Get them prioritized with the Eisenhower matrix and a suggested time-block schedule."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5 space-y-4 h-fit">
          <div className="space-y-2">
            <Label>Your tasks &amp; goals</Label>
            <Textarea
              rows={14}
              placeholder={"- Finish Q3 report\n- Reply to client emails\n- Prep slides for Friday\n- Review pull request..."}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={ai.isPending || !tasks.trim()} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {ai.isPending ? "Planning..." : "Plan My Day"}
          </Button>
        </Card>
        <div>
          <AiOutput
            content={ai.data ?? ""}
            isLoading={ai.isPending}
            error={ai.error?.message}
            emptyHint="Your prioritized plan will appear here."
          />
          <AiDisclaimer />
        </div>
      </div>
    </FeaturePage>
  );
}