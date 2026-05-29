"use client";

import Navbar from "@/components/common/Navbar";
import { Bell, AlertCircle } from "lucide-react";
import QueueHeader from "@/features/queue/components/QueueHeader";
import { useQueue } from "@/features/queue/hooks/useQueue";
import QueueTokens from "@/features/queue/components/QueueTokens";

export default function QueueMonitor() {
  const { error, refreshCount } = useQueue();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        <QueueHeader refreshCount={refreshCount} />

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <strong>Sync Error:</strong> {error} - Please verify that the
              backend API server is online.
            </div>
          </div>
        )}
        <QueueTokens />
      </main>
    </div>
  );
}
