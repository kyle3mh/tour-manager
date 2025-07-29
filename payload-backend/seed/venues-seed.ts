import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { Payload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const venueSeedPath = path.resolve(__dirname, '../venue-seed-data.json')

export default async function seedVenues(payload: Payload) {
  const file = fs.readFileSync(venueSeedPath, 'utf-8')
  const venues = JSON.parse(file)

  console.log('🌱 Seeding venues...')

  for (const venue of venues) {
    await payload.create({
      collection: 'venues',
      data: venue,
    })
  }

  console.log('✅ Done seeding venues.')
}
