"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const BusinessIndustryStep = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Organization profile</CardTitle>
        <CardDescription>
          High-level context so SAGE can shape automations around what you actually do.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="text-xs text-slate-300">Organization name</label>
        <Input placeholder="Example: Arcadian Systems Co." />
        <label className="text-xs text-slate-300">Industry / domain</label>
        <Input placeholder="Example: retail operations, field services, manufacturing" />
      </CardContent>
    </Card>
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Operational focus</CardTitle>
        <CardDescription>
          Where do you expect SAGE to deliver value first for this environment?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-200">
        <ul className="space-y-1 list-disc list-inside">
          <li>Inventory and logistics</li>
          <li>Scheduling and coordination</li>
          <li>Security and compliance monitoring</li>
          <li>Knowledge capture and documentation</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export const BusinessSecurityProfileStep = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Access boundaries</CardTitle>
        <CardDescription>
          Define how tightly SAGE should be constrained inside your environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="text-xs text-slate-300">Systems SAGE will eventually touch</label>
        <Input placeholder="Example: ticketing, inventory, time-tracking" />
        <label className="text-xs text-slate-300">Change sensitivity</label>
        <Input placeholder="Example: observe-only at first, then suggest, then act" />
      </CardContent>
    </Card>
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">Security baseline</CardTitle>
        <CardDescription>
          A quick sketch of how strict we should treat keys, sessions, and logs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-200">
        <ul className="space-y-1 list-disc list-inside">
          <li>Hardware-backed keys required for operators.</li>
          <li>Encrypted logs with rotation policies.</li>
          <li>Separation between production and test surfaces.</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export const BusinessSummaryStep = () => (
  <div className="space-y-4">
    <p className="text-sm text-slate-200">
      This is a high-level outline of the organization profile. In later phases, SAGE will use this
      to scaffold dashboards, agents, and runbooks.
    </p>
    <Card className="border-slate-700/60 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-base">What comes next</CardTitle>
        <CardDescription>
          After you finish, SAGE will generate a baseline configuration for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-200 space-y-1">
        <p>• Org profile seeded for future agents</p>
        <p>• Initial security posture documented</p>
        <p>• Starting point for live federation onboarding</p>
      </CardContent>
    </Card>
  </div>
);
