"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, ChevronRight, Menu } from "lucide-react";
import Sidebar from "../staff/sidebar";
import UserDropdown from "../components/UserDropdown";

const participants = [
  {
    name: "John Doe",
    status: "Active",
    tier: "Gold",
    email: "john.doe@example.com",
  },
  {
    name: "Alice Smith",
    status: "Active",
    tier: "Silver",
    email: "alice.smith@studio.com",
  },
  {
    name: "Sarah Chen",
    status: "Waitlist",
    tier: "Platinum",
    email: "sarah.chen@design.co",
  },
  {
    name: "Mark Brown",
    status: "Paused",
    tier: "Basic",
    email: "mark.brown@lab.com",
  },
];

export default function StaffParticipantsPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Participant Directory</h1>
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
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Current Participants
              </h2>
              <p className="text-sm text-gray-500">
                Monitor engagement, tiers, and follow-up status.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Tier</th>
                  <th className="pb-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.email} className="border-t border-gray-100">
                    <td className="py-3 font-semibold text-gray-900">
                      {participant.name}
                    </td>
                    <td className="py-3 text-gray-600">{participant.status}</td>
                    <td className="py-3 text-gray-600">{participant.tier}</td>
                    <td className="py-3 text-gray-600">{participant.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </div>
      </main>
    </div>
  );
}
