"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, ChevronRight, Menu } from "lucide-react";
import Sidebar from "../staff/sidebar";
import UserDropdown from "../components/UserDropdown";

const reports = [
  {
    title: "Weekly Participation",
    detail: "+14% attendance compared to last week.",
  },
  {
    title: "Volunteer Coverage",
    detail: "All shifts filled through Friday.",
  },
  {
    title: "Message Engagement",
    detail: "62% open rate on staff updates.",
  },
];

export default function StaffReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        categories={[]}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Staff Reports</h1>
            </div>
            <UserDropdown
              userName="Admin"
              userRole="ADMIN"
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        <section className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Performance Highlights
              </h2>
              <p className="text-sm text-gray-500">
                Snapshot of operational health and engagement.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {reports.map((report) => (
              <div
                key={report.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {report.title}
                </p>
                <p className="mt-2 text-xs text-gray-500">{report.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
      </main>
    </div>
  );
}
