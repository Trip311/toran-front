/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useEffect} from 'react';
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

    const [title, setTitle] = useState(event?.title || '');
    const [type, setType] = useState<IEvent['type']>(event?.type || 'jira');
    const username = localStorage.getItem('username') || '';

    const startDate = new Date(event?.startDate || slotInfo?.start);
    const endDate = new Date(event?.endDate || slotInfo?.end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    endDate.setDate(startDate.getDate());
    endDate.setHours(17, 30, 0, 0);

    const isGuest = username === 'guest';

    const handleSubmit = async () => {
        
        if (isGuest) {
            alert( "Guest users cannot modify events");
            return;
        }

        const payload: IEvent = {
            id: event?.id || 0,
            title,
            type,
            username,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        }

        try {
            if (isEdit && event?.id) {
                await dispatch(updateEvent({ id: event.id, event: payload })).unwrap();
            } else {
                await dispatch(addEvent(payload)).unwrap();
            }
            onClose();
        } catch (error) {
            alert('Failed to save event: ' + (error as Error).message);
        }
    }

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
    }


    return (
        <div className='modal-overlay'>
            <div className='modal-container'>
                <h3>{isEdit ? 'Edit Event': 'Create Event'}</h3>
                <div className='form-group'>
                    <label>Title</label>
                    <input type='text' value={title} placeholder='Event title' onChange={(e) => setTitle(e.target.value)}></input>
                </div>

                <div className='form-group'>
                    <label>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as any)}>
                        <option value='jira'>Jira</option>
                        <option value='kitchen'>Kitchen</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label>Start</label>
                    <p>{new Date(startDate).toLocaleString()}</p>
                </div>
                <div className='form-group'>
                    <label>End</label>
                    <p>{new Date(endDate).toLocaleString()}</p>
                </div>
                <div className='form-actions'>
                    <button className='btn primary' onClick={handleSubmit}>{isEdit ? 'Update': 'Create'}</button>
                    {isEdit && <button className='btn danger' onClick={handleDelete}>Delete</button>}
                    <button className='btn' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default EventFormModal;