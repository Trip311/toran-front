/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import type { IEvent } from "../../../../interfaces/event.interface";
import EventFormModal from './eventform/eventFormModal';
import { fetchEvents } from "./redux/eventSlice";


const localizer = momentLocalizer(moment);

const MyCalendar: React.FC = () => {

    const events = useAppSelector((state) => state.event.events);

    // convert back from iso
    const calendarEvents = events.map(event => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
    }));
    const username = localStorage.getItem('username');
    const dispatch = useAppDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [slotInfo, setSlotInfo] = useState<any>(null);
    const [currentView, setCurrentView] = useState<View>("week")
    const [currentDate, setCurrentDate] = useState(new Date());

    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

    const handleSelectSlot = (slot: any) => {
        if (username === 'guest') return;
        setSlotInfo(slot);
        setSelectedEvent(null);
        setModalOpen(true);
    }

    const handleChangeView = (view: View)=>{
        console.log(view)
        setCurrentView(view)
        
    }

    const handleDayChange = (date: Date) => {
        console.log('Navigated to:', date);
        setCurrentDate(date);
    };

    const handleSelectEvent = (event: IEvent) => {
        if (username === 'guest') return;
        setSelectedEvent(event);
        setSlotInfo({ start: event.startDate, end: event.endDate})
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
        setSlotInfo(null);
    }

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username && username !== 'guest') {
            dispatch(fetchEvents());
        }
    }, [dispatch])

    
    const eventStyleGetter = (event: IEvent) => {
        const backgroundColor = event.type === 'jira' ? '#add8e6' : '#90EE90';
        return {
            style: {
                backgroundColor,
                color: 'white',
                border: 'none'
            }
        }
    }
    
    
    return (
        <div style={{ padding: '30px', flex: 1 }}>
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    height: '95%'
                }}>
                <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="startDate"
                endAccessor="endDate"
                selectable
                date={currentDate}
                onView={handleChangeView}
                view={currentView}
                defaultView="week"
                onNavigate={handleDayChange} 
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: ({ event }) => (
                        <div>
                            <strong>{event.title}</strong>
                            <div style={{ fontSize: '0.85rem', color: 'black'}}>

                                {event.username}
                            </div>
                        </div>
                    )
                }}
                />
                {modalOpen && (
                    <EventFormModal onClose={closeModal} slotInfo={slotInfo} event={selectedEvent}/>

                )}
            </div>
        </div>
    )
}

export default MyCalendar;