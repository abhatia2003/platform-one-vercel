"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Menu,
  LayoutGrid,
  Calendar,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import EventDetailModal from "./components/EventDetailModal";
import UserDropdown from "../components/UserDropdown";
import UserSidebar from "../components/UserSidebar";

type CalendarEvent = {
  id: string;
  name: string;
  start: string;
  end: string;
  location: string;
  minTier: string;
};

type FilterType = "all" | "booked";

// Mock user data - In production, this would come from authentication context
// Using the first seed user from the database (walter@participant.com)
const MOCK_USER = {
  id: "", // Will be set from localStorage or hardcoded after first login
  name: "Walter Sullivan",
  role: "PARTICIPANT" as "PARTICIPANT" | "VOLUNTEER",
};

// Placeholder - should be replaced with actual authentication
// For now, we'll fetch the first participant user from the database
const getUserId = async () => {
  try {
    const response = await fetch("/api/users?role=PARTICIPANT&take=1");
    if (response.ok) {
      const users = await response.json();
      if (users[0]) return users[0].id;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
  return "";
};

const categories = [
  {
    name: "Workshops",
    color: "bg-orange-100 text-orange-700",
    dotColor: "bg-orange-500",
  },
  {
    name: "Counseling",
    color: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
  },
  {
    name: "Community",
    color: "bg-green-100 text-green-700",
    dotColor: "bg-green-500",
  },
  {
    name: "Volunteering",
    color: "bg-purple-100 text-purple-700",
    dotColor: "bg-purple-500",
  },
];

export default function Home() {
  const router = useRouter();

  const [currentMonth] = useState("January 2026");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("Participant");
  const [totalBookedHours, setTotalBookedHours] = useState<number>(0);
  const [numberOfEventsBooked, setNumberOfEventsBooked] = useState<number>(0);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [bookedEventIds, setBookedEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  const fetchUserAndEvents = async () => {
    try {
      setLoading(true);
      // Fetch first participant user
      const userResponse = await fetch("/api/users?role=PARTICIPANT&take=1");
      if (userResponse.ok) {
        const users = await userResponse.json();
        if (users[0]) {
          const currentUserId = users[0].id;
          setUserId(currentUserId);
          setUserName(users[0].name);

          // Fetch user's bookings
          const bookingsResponse = await fetch(
            `/api/bookings?userId=${currentUserId}`
          );
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();

            // Calculate total booked hours and count events
            let totalHours = 0;
            const bookedIds = new Set<string>();

            bookingsData.forEach((booking: any) => {
              bookedIds.add(booking.eventId);
              const eventStart = new Date(booking.event.start);
              const eventEnd = new Date(booking.event.end);
              const hours =
                (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
              totalHours += hours;
            });

            setTotalBookedHours(Math.round(totalHours * 10) / 10); // Round to 1 decimal
            setNumberOfEventsBooked(bookingsData.length);
            setBookedEventIds(bookedIds);
          }
        }
      }

      // Fetch events
      const eventsResponse = await fetch("/api/events");
      if (eventsResponse.ok) {
        const data = await eventsResponse.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleBookingsClick = () => {
    router.push("/bookings");
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  const handleBookingSuccess = async () => {
    setSuccessMessage("Successfully booked the event!");
    
    // Refresh events and update booked events list
    try {
      // Fetch updated bookings
      if (userId) {
        const bookingsResponse = await fetch(`/api/bookings?userId=${userId}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const bookedIds = new Set<string>();
          
          bookingsData.forEach((booking: any) => {
            bookedIds.add(booking.eventId);
          });
          
          setBookedEventIds(bookedIds);
        }
      }
      
      // Refresh events
      fetchEvents();
    } catch (error) {
      console.error("Error refreshing bookings:", error);
    }
    
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleUnbookSuccess = async () => {
    setSuccessMessage("Successfully cancelled your booking!");
    
    // Refresh events and update booked events list
    try {
      // Fetch updated bookings
      if (userId) {
        const bookingsResponse = await fetch(`/api/bookings?userId=${userId}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const bookedIds = new Set<string>();
          
          bookingsData.forEach((booking: any) => {
            bookedIds.add(booking.eventId);
          });
          
          setBookedEventIds(bookedIds);
        }
      }
      
      // Refresh events
      fetchEvents();
    } catch (error) {
      console.error("Error refreshing bookings:", error);
    }
    
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // January 2025 calendar data (starting with December 30, 2024 to fill the grid)
  const calendarDays = [
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
  ];

  const getEventsForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    // Filter events that fall on this day in January 2026
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      const matchesDate = (
        eventDate.getDate() === day &&
        eventDate.getMonth() === 0 && // January
        eventDate.getFullYear() === 2026
      );
      
      if (!matchesDate) return false;
      
      // Apply filter based on selected filter type
      if (filterType === "booked") {
        return bookedEventIds.has(event.id);
      }
      
      return true;
    });
  };

  const getCategoryColor = (eventName: string) => {
    // Simple categorization based on event name keywords
    const name = eventName.toLowerCase();
    if (name.includes("workshop")) return "bg-orange-100 text-orange-700 border-orange-200";
    if (name.includes("counseling") || name.includes("session")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (name.includes("community") || name.includes("park")) return "bg-green-100 text-green-700 border-green-200";
    if (name.includes("volunteer")) return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-gray-100 text-gray-700 border-gray-200"; // default
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        totalBookedHours={totalBookedHours}
        numberOfEventsBooked={numberOfEventsBooked}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <p className="text-xs text-gray-500">
                  Calendar / Browse Events
                </p>
                <h2 className="text-lg font-bold text-gray-900">
                  {currentMonth}
                </h2>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button className="px-4 py-2 text-slate-900 font-bold hover:bg-slate-100 rounded-lg">
                TODAY
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <UserDropdown
                userName={userName}
                userRole="PARTICIPANT"
              />
            </div>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-8 mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800">
              {successMessage}
            </p>
          </div>
        )}

        {/* Filter Section */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Show:</span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType("booked")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "booked"
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Booked Events
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                <p className="mt-4 text-gray-600">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {daysOfWeek.map((day, index) => {
                const isWeekend = day === "SAT" || day === "SUN";
                return (
                  <div
                    key={index}
                    className={`px-4 py-3 text-center text-xs font-bold uppercase ${
                      isWeekend ? "text-orange-500" : "text-gray-500"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((dayData, index) => {
                const dayEvents = getEventsForDay(
                  dayData.day,
                  dayData.isCurrentMonth
                );

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] border-r border-b border-gray-100 p-3 cursor-pointer transition-colors ${
                      !dayData.isCurrentMonth ? "bg-gray-50" : ""
                    } hover:bg-red-50 `}
                  >
                    <div
                      className={`text-base font-bold mb-2 ${
                        dayData.isCurrentMonth
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {dayData.day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event.id)}
                          className={`text-xs px-2 py-1 rounded border ${getCategoryColor(
                            event.name
                          )} font-semibold truncate cursor-pointer hover:shadow-sm transition-shadow`}
                          title={`${event.name} - Click to view details`}
                        >
                          {event.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Event Detail Modal */}
      {userId && (
        <EventDetailModal
          isOpen={isModalOpen}
          eventId={selectedEventId}
          userId={userId}
          userRole={MOCK_USER.role}
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
          onUnbookSuccess={handleUnbookSuccess}
        />
      )}
    </div>
  );
}
