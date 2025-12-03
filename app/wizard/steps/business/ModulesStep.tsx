"use client";

import { MODULE_CATEGORIES } from "../../config/modules";
import ModuleCard from "../../components/ModuleCard";
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

  return (
    <div className="flex flex-col sage-stack-xl">
      {MODULE_CATEGORIES.map((cat) => (
        <div key={cat.id} className="sage-stack-lg">
          <h2 className="sage-h2">{cat.label}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sage-stack-lg">
            {cat.modules.map((mod) => (
              <ModuleCard
                key={mod.id}
                label={mod.label}
                selected={selected.includes(mod.id)}
                onClick={() => toggleModule(mod.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

