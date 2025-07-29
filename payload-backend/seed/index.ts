import dotenv from 'dotenv'
import payload from 'payload'
import seedVenues from './venues-seed.js'
import seedUsers from './users-seed.js'
dotenv.config()

const run = async () => {
  const configModule = await import('../src/payload.config.js')
  const config = configModule.default

  await payload.init({
    config,
  })

  console.log('Payload initialized')

  await seedVenues(payload)
  await seedUsers(payload)

  console.log('🌱 Seeding complete')
  process.exit(0)
}

run()
