export interface IEvent {
    id?: number;
    type: 'jira' | 'kitchen';
    username: string;
    startDate: Date; // ISO string from backend
    endDate: Date;
    note: string;
    repeatGroupId?: string;
}