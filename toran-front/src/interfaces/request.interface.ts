export interface IRequest {
  id?: number;
  fromUser: string;
  fromDate: string;
  toUser?: string | null;
  toDate?: string | null;
  shiftType: 'jira' | 'kitchen';
  reason: string;
}
