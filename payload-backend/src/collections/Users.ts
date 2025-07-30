import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  labels: {
    singular: 'User', 
    plural: 'Users',
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'agent',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Agent', value: 'agent' },
        { label: 'Venue', value: 'venue' },
      ],
    },
    {
      name: 'linkedVenue',
      type: 'relationship',
      relationTo: 'venues',
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData.role === 'venue',
      },
    },
  ],
}
