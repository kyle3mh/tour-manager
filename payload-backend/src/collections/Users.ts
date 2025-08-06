import { CollectionConfig } from 'payload'
import { loginAfterCreate } from '../hooks/loginAfterCreate'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  // hooks: {
  //   afterChange: [loginAfterCreate], // ✅ use the updated hook here
  // },
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  access: {
    read: () => true,
    create: () => true, // ✅ allow public signup
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      saveToJWT: true,
      access: {
        read: () => true,
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'agent',
      options: [
        { label: 'Agent', value: 'agent' },
        { label: 'Venue', value: 'venue' },
      ],
      access: {
        create: () => true,
      },
      saveToJWT: true,
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
