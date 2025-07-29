import { Payload } from 'payload'

const users = [
  {
    email: 'admin@tourmanager.live',
    password: 'admin',
    role: 'admin',
  },
  {
    email: 'agent1@tourmanager.live',
    password: 'agent1',
    role: 'agent',
  },
  {
    email: 'venue1@tourmanager.live',
    password: 'venue1',
    role: 'venue',
    linkedVenueName: 'The Roundhouse',
  },
]

export default async function seedUsers(payload: Payload) {
  console.log('🌱 Seeding users...')

  // Get venue ID to link to venue1
  const venueResult = await payload.find({
    collection: 'venues',
    where: {
      name: {
        equals: users[2].linkedVenueName,
      },
    },
  })

  const linkedVenueId = venueResult.docs[0]?.id

  for (const user of users) {
    const data: any = {
      email: user.email,
      password: user.password,
      role: user.role,
    }

    if (user.role === 'venue' && linkedVenueId) {
      data.linkedVenue = linkedVenueId
    }

    await payload.create({
      collection: 'users',
      data,
    })
  }

  console.log('✅ Users seeded')
}
