import React from "react";
import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy – SolveItCalculator | AdSense, GDPR & CCPA Disclosures",
  description: "Official privacy charter for SolveItCalculator.com detailing local in-browser calculation guarantees, Google AdSense compliance, cookie policies, and statutory rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PrivacyClient />
    </div>
  );
}
