import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";

import { AiDisclaimer, AiOutput } from "@/components/ai-output";
import { FeaturePage } from "@/components/feature-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/hooks/use-ai";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkPilot AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const ai = useAi("research");

  const onGenerate = () => {
    if (!topic.trim()) return;
    ai.mutate([{ role: "user", content: `Research topic: ${topic}` }]);
  };

  return (
    <FeaturePage
      icon={BookOpen}
      title="AI Research Assistant"
      description="Enter a topic or question. Get a structured brief with insights, context, perspectives, and next steps."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5 space-y-4 h-fit">
          <div className="space-y-2">
            <Label>Topic or research question</Label>
            <Textarea
              rows={10}
              placeholder="e.g. The state of AI agents in enterprise software in 2025"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={ai.isPending || !topic.trim()} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {ai.isPending ? "Researching..." : "Research Topic"}
          </Button>
        </Card>
        <div>
          <AiOutput
            content={ai.data ?? ""}
            isLoading={ai.isPending}
            error={ai.error?.message}
            emptyHint="Your structured research brief will appear here."
          />
          <AiDisclaimer />
        </div>
      </div>
    </FeaturePage>
  );
}