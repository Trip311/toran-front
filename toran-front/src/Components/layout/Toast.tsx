import React, { useEffect } from 'react';
import type { IToastProps } from '../../interfaces/toast.props';

const Toast: React.FC<IToastProps> = ({ message, onClose }) => {

    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose])

    return (
        <div>
            <span className='font-semibold'>{message}</span>
        </div>
    )
}
export default Toast;