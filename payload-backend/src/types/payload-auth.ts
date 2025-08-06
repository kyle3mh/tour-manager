import { PayloadRequest } from 'payload'

export interface AuthenticatedRequest extends PayloadRequest {
  login: (user: any, options?: any) => Promise<void>
}
