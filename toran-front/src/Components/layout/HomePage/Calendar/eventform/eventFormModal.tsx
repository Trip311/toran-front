/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { addEvent, updateEvent, deleteEvent } from '../redux/eventSlice';
import type { IEvent } from '../../../../../interfaces/event.interface';
import './eventFormModal.scss';

interface Props {
    onClose: () => void;
    slotInfo: any;
    event: IEvent | null;
}

const EventFormModal: React.FC<Props> = ({ onClose, slotInfo, event }) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(event);

    const [note, setNote] = useState(event?.note || '');
    const [type, setType] = useState<IEvent['type']>(event?.type || 'jira');
    const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly-2' | 'weekly-3' | 'monthly'>('none');
    const username = localStorage.getItem('username') || '';

    const startDate = new Date(event?.startDate || slotInfo?.start);
    const endDate = new Date(event?.endDate || slotInfo?.end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    endDate.setDate(startDate.getDate());
    endDate.setHours(17, 30, 0, 0);

    const isGuest = username === 'guest';

    const getRepeatedEvents = (): IEvent[] => {
        const base = new Date(startDate);
        const result: IEvent[] = [];

        const weeks = repeat === 'weekly-2' ? 2 : repeat === 'weekly-3' ? 3 : 1;
        const endOfMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

        if (repeat === 'none') {
            result.push({ id: 0, type, username, startDate: new Date(startDate), endDate: new Date(endDate), note });
        } else if (repeat === 'daily') {
            for (let i = 0; i < 7; i++) {
                const s = new Date(base);
                const e = new Date(endDate);
                s.setDate(s.getDate() + i);
                e.setDate(e.getDate() + i);
                result.push({ id: 0, type, username, startDate: s, endDate: e, note });
            }
        } else if (repeat.startsWith('weekly')) {
            for (let i = 0; i < weeks; i++) {
                const s = new Date(base);
                const e = new Date(endDate);
                s.setDate(s.getDate() + i * 7);
                e.setDate(e.getDate() + i * 7);
                result.push({ id: 0, type, username, startDate: s, endDate: e, note });
            }
        } else if (repeat === 'monthly') {
            for (let i = 1; i <= endOfMonth; i++) {
                const date = new Date(base.getFullYear(), base.getMonth(), i);
                if (date.getDay() === base.getDay()) {
                    const s = new Date(date);
                    const e = new Date(date);
                    e.setHours(17, 30, 0, 0);
                    result.push({ id: 0, type, username, startDate: s, endDate: e, note });
                }
            }
        }

        return result;
    };

    const handleSubmit = async () => {
        if (isGuest) {
            alert("Guest users cannot modify events");
            return;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize to start of the day
        if (startDate < now) {
            alert("You cannot create or edit events in the past.");
            return;
        }

        try {
            if (isEdit && event?.id) {
                await dispatch(updateEvent({ id: event.id, event: { type, note } })).unwrap();
            } else {
                const events = getRepeatedEvents();
                for (const ev of events) {
                    await dispatch(addEvent(ev)).unwrap();
                }
            }
            onClose();
        } catch (error) {
            alert('Failed to save event: ' + (error as Error).message);
        }
    };

    const handleDelete = async () => {
        if (isGuest) {
            alert("Guest users cannot delete events");
            return;
        }

        try {
            if (event?.id) {
                await dispatch(deleteEvent(event.id)).unwrap();
            }
            onClose();
        } catch (error) {
            alert('Failed to delete event: ' + (error as Error).message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h3>{isEdit ? 'Edit Event' : 'Create Event'}</h3>

                <div className="form-group">
                    <label>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as IEvent['type'])}>
                        <option value="jira">Jira</option>
                        <option value="kitchen">Kitchen</option>
                    </select>
                </div>

                {!isEdit && (
                <div className="form-group">
                    <label>Repeat</label>
                    <select value={repeat} onChange={(e) => setRepeat(e.target.value as any)}>
                        <option value="none">Daily</option>
                        <option value="daily">Weekly (1 weeks)</option>
                        <option value="weekly-2">Weekly (2 weeks)</option>
                        <option value="weekly-3">Weekly (3 weeks)</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>)}

                <div className="form-group">
                    <label>Start</label>
                    <p>{startDate.toLocaleString()}</p>
                </div>
                <div className="form-group">
                    <label>End</label>
                    <p>{endDate.toLocaleString()}</p>
                </div>

                {!isEdit && (
                <div className="form-group">
                    <label>Notes:</label>
                    <textarea value={note} placeholder="Notes" onChange={(e) => setNote(e.target.value)} />
                </div>)}

                <div className="form-actions">
                    <button className="btn primary" onClick={handleSubmit}>
                        {isEdit ? 'Update' : 'Create'}
                    </button>
                    {isEdit && (
                        <button className="btn danger" onClick={handleDelete}>
                            Delete
                        </button>
                    )}
                    <button className="btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EventFormModal;
