import React from "react";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-grow pt-24">{children}</main>
    </div>
  );
}
