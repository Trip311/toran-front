import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import type { IEvent } from "../../../../interfaces/event.interface";
import EventFormModal from "./eventform/eventFormModal";
import { fetchEvents } from "./redux/eventSlice";

const localizer = momentLocalizer(moment);

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
    }, [dispatch]);

    const calendarEvents = events.map((event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
    }));

    const isPastDate = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    const handleSelectSlot = (slot: any) => {
        if (username === "guest") return;

        if (isPastDate(slot.start)) {
            return; // Don't open modal for past dates
        }

        setSlotInfo(slot);
        setSelectedEvent(null);
        setModalOpen(true);
    };

    const handleSelectEvent = (event: IEvent) => {
        if (username === "guest") return;

        if (isPastDate(event.startDate)) {
            return; // Don't allow editing past events
        }

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

    return (
        <div style={{ padding: "30px", flex: 1 }}>
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    height: "95%",
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
                    min={new Date(1970, 1, 1, 9, 0)}     // 09:00
                    max={new Date(1970, 1, 1, 17, 30)}   // 17:30
                    components={{
                        event: ({ event }) => (
                            <div>
                                <div style={{ fontSize: "0.85rem", color: "black" }}>{event.username}</div>
                                <strong>{event.note}</strong>
                            </div>
                        ),
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


