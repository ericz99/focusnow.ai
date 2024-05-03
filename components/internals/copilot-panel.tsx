import React from "react";

export function CopilotPanel() {
  return (
    <div className="flex-1 flex flex-col p-4 relative w-full h-full">
      <div className="w-full h-full rounded-lg border-x-2 border-b-2 border-solid border-orange-900">
        <div className="w-full rounded-t-lg p-3 bg-orange-900 text-lg text-white font-semibold">
          Copilot
        </div>
      </div>
    </div>
  );
}
