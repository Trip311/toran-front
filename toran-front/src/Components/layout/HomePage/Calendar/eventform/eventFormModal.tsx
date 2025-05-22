/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useEffect} from 'react';
import { useAppDispatch } from '../redux/eventhooks';
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

    const startDate = event?.startDate || slotInfo?.start;
    const endDate = event?.endDate || slotInfo?.end;
    startDate.setHours(8, 0, 0, 0);
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    endDate.setDate(startDate.getDate());
    endDate.setHours(17, 30, 0, 0);

    const isGuest = username === 'guest';

    const handleSubmit = () => {
        
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

        if (isEdit && event?.id) {
            dispatch(updateEvent({ id: event.id, event: payload}));
        } else {
            dispatch(addEvent(payload));
        }

        onClose();
    }

    const handleDelete = () => {
        if (isGuest) {
            alert("Guest users cannot delete events");
            return;
        }

        if (event?.id) {
            dispatch(deleteEvent(event.id));
        }

        onClose();
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