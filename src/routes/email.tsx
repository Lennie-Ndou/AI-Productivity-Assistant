import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import { AiDisclaimer, AiOutput } from "@/components/ai-output";
import { FeaturePage } from "@/components/feature-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/hooks/use-ai";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkPilot AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Client");
  const [brief, setBrief] = useState("");
  const ai = useAi("email");

  const onGenerate = () => {
    if (!brief.trim()) return;
    const prompt = `Write an email with the following details.\n\nRecipient: ${recipient || "(unspecified)"}\nTone: ${tone}\nAudience: ${audience}\n\nWhat the email should accomplish:\n${brief}`;
    ai.mutate([{ role: "user", content: prompt }]);
  };

  return (
    <FeaturePage
      icon={Mail}
      title="Smart Email Generator"
      description="Generate a polished email with the right tone for your audience. Provide a brief and let AI draft it."
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5 space-y-4 h-fit">
          <div className="space-y-2">
            <Label>Recipient (optional)</Label>
            <Input placeholder="e.g. Sarah, VP of Marketing" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Concise"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Client", "Manager", "Team", "Executive", "Vendor", "Candidate"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>What should the email say?</Label>
            <Textarea
              rows={8}
              placeholder="e.g. Follow up on last week's proposal and propose a meeting next Tuesday."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>
          <Button onClick={onGenerate} disabled={ai.isPending || !brief.trim()} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {ai.isPending ? "Generating..." : "Generate Email"}
          </Button>
        </Card>
        <div>
          <AiOutput
            content={ai.data ?? ""}
            isLoading={ai.isPending}
            error={ai.error?.message}
            emptyHint="Fill out the form and click Generate to draft your email."
          />
          <AiDisclaimer />
        </div>
      </div>
    </FeaturePage>
  );
}