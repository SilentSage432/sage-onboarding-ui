"use client";

import { MODULE_CATEGORIES } from "../../config/modules";
import ModuleCard from "../../components/ModuleCard";
import SectionDivider from "../../components/SectionDivider";
import { useFormContext } from "react-hook-form";

export default function ModulesStep() {
  const { watch, setValue } = useFormContext();

  const selected = watch("modules") || [];

  const toggleModule = (id: string) => {
    if (selected.includes(id)) {
      setValue(
        "modules",
        selected.filter((m: string) => m !== id)
      );
    } else {
      setValue("modules", [...selected, id]);
    }
  };

  const categories = ["automation", "monitoring", "analytics", "security"];

  return (
    <div className="px-10 pb-20 pt-6">
      {categories.map((cat) => {
        const categoryData = MODULE_CATEGORIES.find((c) => c.id === cat);
        if (!categoryData) return null;

        return (
          <div key={cat}>
            <SectionDivider label={cat} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryData.modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  selected={selected.includes(module.id)}
                  onToggle={() => toggleModule(module.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

