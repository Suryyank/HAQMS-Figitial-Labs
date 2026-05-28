import React from "react";
import { Monitor, RefreshCw } from "lucide-react";

const QueueHeader = ({ refreshCount = 0 }) => {
  return (
    <div className="glass p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
          <Monitor className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Live Public Monitor Board
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">
            Real-time physician calling boards. Auto-syncs every 3 seconds.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wide border border-teal-500/20">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Auto Refreshing
        </span>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 text-xs font-mono">
          Polls: {refreshCount}
        </div>
      </div>
    </div>
  );
};

export default QueueHeader;
