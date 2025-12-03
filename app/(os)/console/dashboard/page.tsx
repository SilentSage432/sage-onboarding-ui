"use client";

export default function DashboardPage() {
  return (
    <div className="w-full h-full text-gray-200">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome to SAGE Enterprise Console
      </h1>
      <p className="text-gray-400 text-sm max-w-2xl">
        Your operational environment is now live. Use the navigation rail to
        access your modules, inspect agents, view mesh activity, manage
        security posture, or configure advanced settings for your organization.
      </p>
      {/* HADRA-01 is launched globally via the dock orb in the root layout. */}
    </div>
  );
}




