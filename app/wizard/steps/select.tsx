"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";

const AccountTypeStep = () => {
  const { setMode, setStepIndex } = useWizardStore();

  const handleSelectPersonal = () => {
    setMode("personal");
    // Move to the next step after the selector step
    setStepIndex(1);
  };

  const handleSelectBusiness = () => {
    setMode("business");
    // Move to the next step after the selector step
    setStepIndex(1);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card
        className="border-slate-700/60 bg-slate-900/60 hover:border-sky-400/70 hover:bg-slate-900/90 cursor-pointer transition-all duration-200"
        onClick={handleSelectPersonal}
      >
        <CardHeader>
          <CardTitle className="text-base">Personal workspace</CardTitle>
          <CardDescription>
            Set up SAGE for your own devices, experiments, and daily flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button
            onClick={handleSelectPersonal}
            className="mt-4 rounded-full bg-white text-slate-900 font-semibold px-5 py-2 shadow-sm hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200"
          >
            Continue as individual
          </Button>
        </CardContent>
      </Card>
      <Card
        className="border-slate-700/60 bg-slate-900/60 hover:border-emerald-400/70 hover:bg-slate-900/90 cursor-pointer transition-all duration-200"
        onClick={handleSelectBusiness}
      >
        <CardHeader>
          <CardTitle className="text-base">Business / team</CardTitle>
          <CardDescription>
            Configure SAGE as an operations layer for your company or team.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button
            onClick={handleSelectBusiness}
            className="mt-4 rounded-full bg-white text-slate-900 font-semibold px-5 py-2 shadow-sm hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200"
          >
            Continue as organization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTypeStep;
