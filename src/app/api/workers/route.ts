import { NextResponse } from 'next/server'
import { workerProfiles } from '../../../data/workers'

function normalizeString(s?: string) {
  return (s || '').toString().toLowerCase()
}

function parseNumber(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = url.searchParams
  const categories = params.getAll('category')
  const city = params.get('city') || 'all'
  const sort = params.get('sort') || 'top_rated'
  const rating = Number(params.get('rating') || 0)
  const availableOnly = params.get('availableOnly') === '1'
  const page = Number(params.get('page') || 1)
  const per_page = Number(params.get('per_page') || 12)

  let list = workerProfiles.map((worker) => {
    const rating = Number(worker.rating)
    const startingPrice = parseNumber(worker.startingPrice)
    const avgResponseMinutes = parseNumber(worker.responseAverage)

    return {
      id: worker.slug,
      name: worker.name,
      photo: worker.photo || null,
      trade: worker.trade,
      skills: worker.skills,
      city: worker.city,
      area: worker.location,
      rating: Number.isFinite(rating) ? rating : 0,
      totalJobs: worker.jobs,
      experienceYears: parseNumber(worker.experience),
      startingPrice,
      isVerified: worker.verified,
      isAvailable: worker.status === 'online',
      avgResponseMinutes,
    }
  })

  if (categories.length && !categories.includes('all')) {
    const catSet = new Set(categories.map((c) => normalizeString(c)))
    list = list.filter((w) => catSet.has(normalizeString(w.trade)) || w.skills.some(s=>catSet.has(normalizeString(s))))
  }

  if (city && city !== 'all') {
    list = list.filter((w) => normalizeString(w.city) === normalizeString(city))
  }

  if (rating && rating > 0) list = list.filter((w) => w.rating >= rating)
  if (availableOnly) list = list.filter((w) => w.isAvailable)

  if (sort === 'top_rated') list.sort((a,b)=>b.rating - a.rating)
  else if (sort === 'most_jobs') list.sort((a,b)=>b.totalJobs - a.totalJobs)
  else if (sort === 'price_asc') list.sort((a,b)=>a.startingPrice - b.startingPrice)
  else if (sort === 'price_desc') list.sort((a,b)=>b.startingPrice - a.startingPrice)

  const total = list.length
  const start = (page - 1) * per_page
  const end = start + per_page
  const paged = list.slice(start, end)

  return NextResponse.json({ data: paged, total, page, per_page })
}
