import React from "react";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About Us – SolveItCalculator | Institutional Precision & Quality Verified",
  description: "Learn about SolveItCalculator's engineering pipeline, privacy-first sandboxed architecture, and our commitment to rigorous financial and mathematical accuracy.",
};

export default function AboutPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <AboutClient />
    </div>
  );
}
