/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import type { IEvent } from "../../../../interfaces/event.interface";
import EventFormModal from "./eventform/eventFormModal";
import { fetchEvents } from "./redux/eventSlice";

const localizer = momentLocalizer(moment);

const navButtonStyle = {
  background: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 14px",
  fontWeight: 500,
  fontSize: "0.9rem",
  cursor: "pointer"
};

const viewButtonStyle = {
  borderRadius: "8px",
  padding: "8px 14px",
  fontWeight: 500,
  fontSize: "0.9rem",
  cursor: "pointer"
};

const stripTime = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const MyCalendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.event.events);
  const username = localStorage.getItem("username");

  const [modalOpen, setModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [currentView, setCurrentView] = useState<View>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (username && username !== "guest") {
      dispatch(fetchEvents());
    }
  }, [dispatch, username]);

  const calendarEvents = events.map((event) => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  }));

  const isPastDate = (date: Date): boolean => {
    return stripTime(date) < stripTime(new Date());
  };

  const handleSelectSlot = (slot: any) => {
    if (username === "guest") return;
    if (isPastDate(slot.start)) return;

    setSlotInfo(slot);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = (event: IEvent) => {
    if (username === "guest") return;
    if (isPastDate(event.startDate)) return;

    setSelectedEvent(event);
    setSlotInfo({ start: event.startDate, end: event.endDate });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSlotInfo(null);
  };

  const eventStyleGetter = (event: IEvent) => {
    const backgroundColor = event.type === "jira" ? "#3b82f6" : "#10b981";
    return {
      style: {
        backgroundColor,
        color: "black",
        border: "none",
        padding: "2px",
        borderRadius: "4px",
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
    const isActive = (val: string) => view === val;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => onNavigate("PREV")} style={navButtonStyle}>
            ← Back
          </button>
          <button onClick={() => onNavigate("TODAY")} style={navButtonStyle}>
            Today
          </button>
          <button onClick={() => onNavigate("NEXT")} style={navButtonStyle}>
            Next →
          </button>
        </div>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#0f0f0f", // deep blue
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            letterSpacing: "0.5px",
            flexGrow: 1,
            textAlign: "center",
            minWidth: "180px",
          }}
        >
          {label}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {["month", "week", "day", "agenda"].map((val) => (
            <button
              key={val}
              onClick={() => onView(val)}
              style={{
                ...viewButtonStyle,
                background: isActive(val) ? "#1e3a8a" : "white",
                color: isActive(val) ? "white" : "black",
                border: isActive(val) ? "none" : "1px solid #ccc",
              }}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div style={{ padding: "30px", flex: 1 }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          height: "95%",
          // width: "80%" // leave that option for notes section
        }}
      >
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="startDate"
          endAccessor="endDate"
          selectable
          date={currentDate}
          onNavigate={setCurrentDate}
          view={currentView}
          onView={setCurrentView}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          min={new Date(1970, 1, 1, 9, 0)}
          max={new Date(1970, 1, 1, 17, 30)}
  components={{
    toolbar: CustomToolbar,
    event: ({ event }) => (
      <div>
        <div style={{ fontSize: "0.85rem", color: "black" }}>
          {event.username}
        </div>
        <strong>{event.note}</strong>
      </div>
    ),
    month: {
      dateHeader: ({ label }: { label: string; }) => (
        <div
          style={{
            color: "black",
            padding: "4px",
            fontWeight: 600,
            fontSize: "0.9rem",
            textAlign: "right",
          }}
        >
          {label}
        </div>
      ),
    },
  }}
/>
        {modalOpen && (
          <EventFormModal onClose={closeModal} slotInfo={slotInfo} event={selectedEvent} />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
