export interface IToastProps {
    message: string;
    type: 'success' | 'error';
    onClose:() => void;
}