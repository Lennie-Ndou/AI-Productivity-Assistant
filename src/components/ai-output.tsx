import ReactMarkdown from "react-markdown";
import { AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AiOutput({
  content,
  isLoading,
  error,
  emptyHint,
}: {
  content: string;
  isLoading: boolean;
  error?: string | null;
  emptyHint?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="relative p-6 min-h-[300px]">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 text-destructive">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      ) : content ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="absolute top-3 right-3"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyHint ?? "Your AI-generated result will appear here."}</p>
      )}
    </Card>
  );
}

export function AiDisclaimer() {
  return (
    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
      <AlertCircle className="h-3 w-3" />
      AI-generated content may require human review.
    </p>
  );
}