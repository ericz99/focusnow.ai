"use client";

import React from "react";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/codeblock";
import { MemoizedReactMarkdown } from "@/components/internals/markdown";
import { IconOpenAI, IconUser } from "@/components/ui/icon";
import { useStreamableText } from "@/lib/hooks";
import { spinner } from "@/components/ui/spinner";
import { StreamableValue } from "ai/rsc";

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full text-slate-700">
      <div className="px-4 py-2 justify-center text-base md:gap-6 m-auto my-4">
        <div className="flex flex-1 text-base mx-auto gap-3 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div
              className={cn(
                "flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-background"
              )}
            >
              <IconUser />
            </div>
          </div>

          <div className="relative flex w-full flex-col lg:w-[calc(100%-115px)]">
            <div className="font-semibold select-none">User</div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BotMessage({
  content,
}: {
  content: string | StreamableValue<string>;
}) {
  const text = useStreamableText(content);

  return (
    <div className="w-full text-slate-700">
      <div className="px-4 py-2 justify-center text-base md:gap-6 m-auto my-4">
        <div className="flex flex-1 text-base mx-auto gap-3 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div className="pt-5">
              <div
                className={cn(
                  "flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-primary text-primary-foreground"
                )}
              >
                <IconOpenAI />
              </div>
            </div>
          </div>

          <div className="relative flex w-full flex-col lg:w-[calc(100%-115px)]">
            <div className="font-semibold select-none">Assistant</div>
            <div className="flex-col gap-1 md:gap-3">
              <MemoizedReactMarkdown
                className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                  },
                  code({ node, inline, className, children, ...props }: any) {
                    const childArray = React.Children.toArray(children);
                    const firstChild = childArray[0] as React.ReactElement;
                    const firstChildAsString = React.isValidElement(firstChild)
                      ? (firstChild as React.ReactElement).props.children
                      : firstChild;

                    if (firstChildAsString === "▍") {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">
                          ▍
                        </span>
                      );
                    }

                    if (typeof firstChildAsString === "string") {
                      childArray[0] = firstChildAsString.replace("`▍`", "▍");
                    }

                    const match = /language-(\w+)/.exec(className || "");

                    if (
                      typeof firstChildAsString === "string" &&
                      !firstChildAsString.includes("\n")
                    ) {
                      return (
                        <code className={className} {...props}>
                          {childArray}
                        </code>
                      );
                    }

                    return (
                      <CodeBlock
                        key={Math.random()}
                        language={(match && match[1]) || ""}
                        value={String(childArray).replace(/\n$/, "")}
                        {...props}
                      />
                    );
                  },
                }}
              >
                {text}
              </MemoizedReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
