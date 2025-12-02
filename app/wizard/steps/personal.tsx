"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const PersonalPreferencesStep = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Daily focus</CardTitle>
        <CardDescription>
          Tell SAGE what you want the system to help you with most.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="text-xs text-slate-300">
          Top priorities (work, study, experiments, etc.)
        </label>
        <Input placeholder="Example: coursework, automation tests, personal knowledge base" />
      </CardContent>
    </Card>
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Notification style</CardTitle>
        <CardDescription>
          How proactive should SAGE be when something needs your attention?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-200">
        <ul className="space-y-1 list-disc list-inside">
          <li>Quiet – only critical events.</li>
          <li>Balanced – important events and daily summaries.</li>
          <li>Active – frequent nudges and suggestions.</li>
        </ul>
        {/* Later phase: real controls (radio buttons / slider) */}
      </CardContent>
    </Card>
  </div>
);

export const PersonalRegionStep = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Region</CardTitle>
        <CardDescription>We'll align defaults to your region and timezone.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="text-xs text-slate-300">Primary region / country</label>
        <Input placeholder="Example: United States" />
        <label className="text-xs text-slate-300">Timezone</label>
        <Input placeholder="Example: America/Boise" />
      </CardContent>
    </Card>
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Privacy baseline</CardTitle>
        <CardDescription>
          High-level preference for how SAGE stores and processes your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-200">
        <ul className="space-y-1 list-disc list-inside">
          <li>Local-first where possible.</li>
          <li>Encrypted sync across your devices.</li>
          <li>Explicit opt-in for any shared analytics.</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export const PersonalSummaryStep = () => (
  <div className="space-y-4">
    <p className="text-sm text-slate-200">
      This is a preview of what your personal workspace initialization will represent. In a later
      phase we'll connect this to real data and show a live summary before the system boots.
    </p>
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">What comes next</CardTitle>
        <CardDescription>
          After you finish, SAGE will provision a personal console tuned to your preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-200 space-y-1">
        <p>• Workspace layout preset</p>
        <p>• Notification profile and cadence</p>
        <p>• Region-aware logs and scheduling defaults</p>
      </CardContent>
    </Card>
  </div>
);
