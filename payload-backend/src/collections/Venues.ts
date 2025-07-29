import { CollectionConfig } from 'payload'

export const Venues: CollectionConfig = {
  access: {
    read: () => true, // Allow all users to read
  },
  slug: 'venues',
  auth: false,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Venue Name',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'capacity',
      type: 'number',
      required: false,
    },
    {
      name: 'address',
      type: 'text',
      required: false,
    },
    {
      name: 'availableDates',
      type: 'array',
      label: 'Available Dates',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
}
