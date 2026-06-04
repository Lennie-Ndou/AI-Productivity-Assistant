import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { FeaturePage } from "@/components/feature-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/hooks/use-ai";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — WorkPilot AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const ai = useAi("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, ai.isPending]);

  const send = async () => {
    const text = input.trim();
    if (!text || ai.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    try {
      const reply = await ai.mutateAsync(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      // error shown inline below
    }
  };

  return (
    <FeaturePage
      icon={MessageSquare}
      title="AI Chatbot"
      description="Chat with your AI assistant about anything in your workflow."
    >
      <Card className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-16">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Ask anything — drafting, brainstorming, summarizing, planning.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <article className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:my-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </article>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {ai.isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </div>
            </div>
          )}
          {ai.error && (
            <div className="text-sm text-destructive text-center">{ai.error.message}</div>
          )}
        </div>
        <div className="border-t p-3 bg-background">
          <div className="flex gap-2 items-end">
            <Textarea
              rows={1}
              placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="resize-none min-h-[44px] max-h-32"
            />
            <Button onClick={send} disabled={ai.isPending || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            AI-generated content may require human review.
          </p>
        </div>
      </Card>
    </FeaturePage>
  );
}