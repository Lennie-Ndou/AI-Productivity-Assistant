import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";

import { AiDisclaimer, AiOutput } from "@/components/ai-output";
import { FeaturePage } from "@/components/feature-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/hooks/use-ai";

export const Route = createFileRoute("/meeting")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkPilot AI" }] }),
  component: MeetingPage,
});

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const ai = useAi("meeting");

  const onGenerate = () => {
    if (!notes.trim()) return;
    ai.mutate([{ role: "user", content: `Summarize these meeting notes:\n\n${notes}` }]);
  };

  return (
    <FeaturePage
      icon={FileText}
      title="Meeting Notes Summarizer"
      description="Paste your meeting notes or transcript. Get key points, decisions, action items, and deadlines."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5 space-y-4 h-fit">
          <div className="space-y-2">
            <Label>Meeting notes or transcript</Label>
            <Textarea
              rows={16}
              placeholder="Paste raw notes, transcript, or bullet points from the meeting..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={ai.isPending || !notes.trim()} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {ai.isPending ? "Summarizing..." : "Summarize Meeting"}
          </Button>
        </Card>
        <div>
          <AiOutput
            content={ai.data ?? ""}
            isLoading={ai.isPending}
            error={ai.error?.message}
            emptyHint="Your structured meeting summary will appear here."
          />
          <AiDisclaimer />
        </div>
      </div>
    </FeaturePage>
  );
}