import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, BookOpen, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkPilot AI" },
      { name: "description", content: "Your AI productivity dashboard." },
    ],
  }),
  component: Index,
});

const features = [
  { title: "Smart Email Generator", desc: "Draft polished emails tuned to tone and audience.", icon: Mail, url: "/email", color: "from-blue-500/15 to-indigo-500/15 text-blue-600" },
  { title: "Meeting Notes Summarizer", desc: "Extract key points, decisions, and action items.", icon: FileText, url: "/meeting", color: "from-emerald-500/15 to-teal-500/15 text-emerald-600" },
  { title: "AI Task Planner", desc: "Prioritize and schedule your day with the Eisenhower matrix.", icon: ListChecks, url: "/tasks", color: "from-amber-500/15 to-orange-500/15 text-amber-600" },
  { title: "AI Research Assistant", desc: "Get structured insights and balanced perspectives.", icon: BookOpen, url: "/research", color: "from-fuchsia-500/15 to-purple-500/15 text-fuchsia-600" },
  { title: "AI Chatbot", desc: "Conversational assistant for anything in your workflow.", icon: MessageSquare, url: "/chat", color: "from-rose-500/15 to-pink-500/15 text-rose-600" },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" /> AI Workplace Productivity
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          Automate your daily work with structured AI assistance.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Generate professional emails, summarize meetings, plan tasks, and research topics — all in one workspace.
        </p>
      </section>

      <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.url} to={f.url} className="group">
            <Card className="p-5 h-full transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
              <div className="flex items-center text-sm font-medium text-primary">
                Open <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        AI-generated content may require human review.
      </p>
    </div>
  );
}
