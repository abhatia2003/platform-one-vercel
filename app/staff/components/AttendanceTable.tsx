import { FileDown } from "lucide-react";
import { Attendee } from "../types";
import { TIER_STYLES, STATUS_STYLES } from "../constants";

type AttendanceTableProps = {
  attendees: Attendee[];
  activeTab: "participants" | "volunteers";
  onTabChange: (tab: "participants" | "volunteers") => void;
  isLoading?: boolean;
  selectedEventTitle?: string;
};

export default function AttendanceTable({
  attendees,
  activeTab,
  onTabChange,
  isLoading = false,
  selectedEventTitle,
}: AttendanceTableProps) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Attendance Management</h3>
          <p className="text-sm text-gray-500">
            {selectedEventTitle
              ? `${selectedEventTitle} - ${activeTab === "participants" ? "Participants" : "Volunteers"}`
              : "Select an event to view attendees"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs border border-gray-200 rounded-lg">
            <FileDown className="w-4 h-4" />
            Export CSV
          </button>
          <button className="px-3 py-2 text-xs bg-slate-900 text-white rounded-lg">
            Manual Registration
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => onTabChange("participants")}
          className={`rounded-full px-4 py-2 text-xs font-semibold ${
            activeTab === "participants"
              ? "bg-slate-900 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Participants
        </button>
        <button
          type="button"
          onClick={() => onTabChange("volunteers")}
          className={`rounded-full px-4 py-2 text-xs font-semibold ${
            activeTab === "volunteers"
              ? "bg-slate-900 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Volunteers
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading attendees...</div>
        ) : attendees.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {selectedEventTitle ? "No attendees found for this event" : "Select an event to view attendees"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="pb-3">User name</th>
                <th className="pb-3">Loyalty status</th>
                <th className="pb-3">Dietary</th>
                <th className="pb-3">Referral</th>
                <th className="pb-3">Last seen</th>
                <th className="pb-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="py-3">
                    <div className="font-semibold text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-400">{row.email}</div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        TIER_STYLES[row.tier]
                      }`}
                    >
                      {row.tier}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{row.dietary}</td>
                  <td className="py-3 text-gray-600">{row.referral}</td>
                  <td className="py-3 text-gray-600">{row.lastSeen}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-semibold ${STATUS_STYLES[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}