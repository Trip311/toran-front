export interface IEvent {
    id?: number;
    title: string;
    type: 'jira' | 'kitchen';
    username: string;
    startDate: Date; // ISO string from backend
    endDate: Date;
}