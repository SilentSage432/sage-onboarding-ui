"use client";

import { Input } from "@/components/ui/input";
import { useOnboardingDataStore } from "../store/useOnboardingDataStore";

export default function Step2Business() {
  const { business, setBusiness } = useOnboardingDataStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Organization Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">Organization Name</label>
        <Input
          placeholder="Organization Name"
          value={business.orgName}
          onChange={(e) => setBusiness({ orgName: e.target.value })}
          className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
        />
        {!business.orgName && (
          <span className="text-xs text-red-400">Required</span>
        )}
      </div>

      {/* Business Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">Business Type</label>
        <select
          value={business.businessType}
          onChange={(e) => setBusiness({ businessType: e.target.value })}
          className="h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" className="bg-black text-white">Select business type...</option>
          <option value="Tech" className="bg-black text-white">Tech</option>
          <option value="Retail" className="bg-black text-white">Retail</option>
          <option value="Medical" className="bg-black text-white">Medical</option>
          <option value="Other" className="bg-black text-white">Other</option>
        </select>
        {!business.businessType && (
          <span className="text-xs text-red-400">Required</span>
        )}
      </div>

      {/* Company Size */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">Company Size</label>
        <select
          value={business.companySize}
          onChange={(e) => setBusiness({ companySize: e.target.value })}
          className="h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" className="bg-black text-white">Select company size...</option>
          <option value="1-5" className="bg-black text-white">1-5</option>
          <option value="5-20" className="bg-black text-white">5-20</option>
          <option value="20-100" className="bg-black text-white">20-100</option>
          <option value="100+" className="bg-black text-white">100+</option>
        </select>
        {!business.companySize && (
          <span className="text-xs text-red-400">Required</span>
        )}
      </div>
    </div>
  );
}

