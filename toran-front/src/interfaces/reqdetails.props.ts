

import { IRequest } from "./request.interface.js";

export interface ReqDetailsProps {
  currentUser: string
  request: IRequest;
  mode?: 'approve' | 'view';
}