import type { CollectionAfterChangeHook } from 'payload'
import type { AuthenticatedRequest } from '../types/payload-auth'

export const loginAfterCreate: CollectionAfterChangeHook = async ({ req, operation, doc }) => {
  const request = req as AuthenticatedRequest

  if (operation === 'create' && !req.user) {
    await request.login(doc)
  }

  return doc
}