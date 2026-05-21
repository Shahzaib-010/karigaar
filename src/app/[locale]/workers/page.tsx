"use client"

import React, { useEffect, useReducer, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

type WorkerListItem = {
  id: string
  name: string
  photo: string | null
  trade: string
  skills: string[]
  city: string
  area: string
  rating: number
  totalJobs: number
  experienceYears: number
  startingPrice: number
  isVerified: boolean
  isAvailable: boolean
  avgResponseMinutes: number
}

type FilterState = {
  categories: string[]
  city: string
  sortBy: 'top_rated' | 'most_jobs' | 'price_asc' | 'price_desc' | 'nearest'
  minRating: number | null
  availableOnly: boolean
  page: number
}

const initialState: FilterState = {
  categories: ['all'],
  city: 'all',
  sortBy: 'top_rated',
  minRating: null,
  availableOnly: false,
  page: 1,
}

function reducer(state: FilterState, action: any): FilterState {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.payload }
    case 'toggleCategory': {
      const cat = action.payload
      if (cat === 'all') return { ...state, categories: ['all'], page: 1 }
      const set = new Set(state.categories.filter(c=>c!=='all'))
      if (set.has(cat)) set.delete(cat)
      else set.add(cat)
      const categories = set.size ? Array.from(set) : ['all']
      return { ...state, categories, page: 1 }
    }
    case 'clear':
      return { ...initialState }
    default:
      return state
  }
}

const CATEGORIES = ['All','Plumber','Electrician','Carpenter','Painter','AC Repair','Mason','Welder','Cleaning','Geyser','Tile Work','Gate & Grill']
const CITIES = ['All Cities','Lahore','Karachi','Islamabad','Rawalpindi','Faisalabad','Multan','Gujranwala','Peshawar','Quetta']

export default function WorkersPage(){
  const t = useTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workers, setWorkers] = useState<WorkerListItem[]>([])
  const [total, setTotal] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(()=>{
    setIsHydrated(true)
  }, [])

  useEffect(()=>{
    // initialize from URL
    const params = Object.fromEntries(Array.from(searchParams.entries()))
    const categories = searchParams.getAll('category')
    dispatch({ type: 'set', payload: {
      categories: categories.length ? categories : ['all'],
      city: params.city || 'all',
      sortBy: (params.sort as any) || 'top_rated',
      minRating: params.rating ? Number(params.rating) : null,
      availableOnly: params.availableOnly === '1',
      page: params.page ? Number(params.page) : 1,
    }})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    const params = new URLSearchParams()
    const activeCategories = state.categories.filter((c) => c !== 'all')
    activeCategories.forEach(c=> params.append('category', c.toLowerCase()))
    if (state.city && state.city !== 'all') params.set('city', state.city.toLowerCase())
    if (state.sortBy && state.sortBy !== 'top_rated') params.set('sort', state.sortBy)
    if (state.minRating) params.set('rating', String(state.minRating))
    if (state.availableOnly) params.set('availableOnly','1')
    if (state.page > 1) params.set('page', String(state.page))
    const url = `${pathname}?${params.toString()}`
    const currentParams = searchParams.toString()
    const nextParams = params.toString()
    if (currentParams !== nextParams) {
      router.replace(url)
    }

    async function fetchData(){
      setLoading(true); setError(null)
      try{
        const res = await fetch(`/api/workers?${params.toString()}`)
        if (!res.ok) throw new Error('Fetch failed')
        const json = await res.json()
        setWorkers(json.data)
        setTotal(json.total)
      }catch(e:any){
        setError(e.message || 'error')
      }finally{ setLoading(false) }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page, state.categories, state.city, state.sortBy, state.minRating, state.availableOnly])

  function toggleCategory(cat:string){
    dispatch({ type: 'toggleCategory', payload: cat.toLowerCase() })
  }

  function clearAll(){ dispatch({ type: 'clear' }) }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-5 w-40 rounded bg-white border border-[#E8E8E4] mb-4" />
          <div className="h-8 w-64 rounded bg-white border border-[#E8E8E4]" />
          <div className="mt-3 h-4 w-96 rounded bg-white border border-[#E8E8E4]" />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="h-40 p-4 bg-white rounded-[12px] border border-[#E8E8E4] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <nav className="text-sm text-[#6B6B6B] mb-4">{t('nav.home')} → {t('workers.browse')}</nav>
        <header className="mb-6">
          <h1 className="text-[#1A1A1A] font-bold text-3xl">{t('workers.title')}</h1>
          <p className="text-[#6B6B6B] text-base mt-2">{t('workers.subtitle')}</p>
          <div className="text-[#6B6B6B] text-sm mt-2">{t('workers.showing', { count: total })}</div>
        </header>

        <section className="bg-transparent">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 items-center">
              {CATEGORIES.map((c)=>{
                const active = state.categories.includes(c.toLowerCase())
                return (
                  <button key={c} onClick={()=>toggleCategory(c)}
                    className={`whitespace-nowrap px-4 py-1.5 text-sm rounded-[20px] ${active? 'bg-[#1D9E75] text-white border-none' : 'bg-white text-[#6B6B6B] border border-[#E8E8E4] hover:border-[#1D9E75]'}`}>
                    {t(`categories.${c.replace(/\s+/g,'_').toLowerCase()}`)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
            <div className="flex gap-2 items-center">
              <select value={state.city} onChange={(e)=>dispatch({type:'set', payload:{city:e.target.value, page:1}})} className="h-10 rounded-md border border-[#E8E8E4] px-3 bg-white text-sm">
                {CITIES.map(c=> <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>
              <select value={state.sortBy} onChange={(e)=>dispatch({type:'set', payload:{sortBy: e.target.value as any, page:1}})} className="h-10 rounded-md border border-[#E8E8E4] px-3 bg-white text-sm">
                <option value="top_rated">{t('sort.top_rated')}</option>
                <option value="most_jobs">{t('sort.most_jobs')}</option>
                <option value="nearest">{t('sort.nearest')}</option>
                <option value="price_asc">{t('sort.price_asc')}</option>
                <option value="price_desc">{t('sort.price_desc')}</option>
              </select>
              <button onClick={()=>dispatch({type:'set', payload:{minRating:4, page:1}})} className={`h-10 px-3 rounded-md border ${state.minRating===4? 'bg-[#1D9E75] text-white border-none' : 'border-[#E8E8E4] text-[#6B6B6B]'}`}>4★ & above</button>
              <button onClick={()=>dispatch({type:'set', payload:{availableOnly: !state.availableOnly, page:1}})} className={`h-10 px-3 rounded-md border ${state.availableOnly? 'bg-[#1D9E75] text-white border-none' : 'border-[#E8E8E4] text-[#6B6B6B]'}`}>{t('filters.available')}</button>
            </div>
            <div className="text-sm text-[#6B6B6B]">{total} {t('workers.found')}</div>
          </div>
        </section>

        <main className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} className="h-40 p-4 bg-white rounded-[12px] border border-[#E8E8E4] animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="font-bold">{t('errors.generic')}</p>
              <p className="text-sm text-[#6B6B6B] mt-2">{t('errors.try_again')}</p>
              <div className="mt-4"><button onClick={()=>dispatch({type:'set', payload:{page:state.page}})} className="px-4 py-2 border border-[#1D9E75] text-[#1D9E75] rounded-md">{t('retry')}</button></div>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl text-[#6B6B6B] mb-3">👤</div>
              <div className="font-bold text-lg">{t('empty.title')}</div>
              <div className="text-sm text-[#6B6B6B] mt-2">{t('empty.subtitle')}</div>
              <div className="mt-4"><button onClick={clearAll} className="text-[#1D9E75]">{t('empty.clear')}</button></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map(w=> (
                  <article key={w.id} className="bg-white p-4 rounded-[12px] border border-[#E8E8E4] hover:border-[#1D9E75] cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full bg-[#DFF3EE] flex-shrink-0 overflow-hidden">
                        {w.photo ? (
                          <Image src={w.photo} alt={w.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#1D9E75] font-bold">{w.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                        )}
                        {w.isVerified && <span className="absolute -top-1 -right-1 text-xs bg-[#1D9E75] text-white px-2 py-0.5 rounded">✓ Verified</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-lg text-[#1A1A1A]">{w.name}</div>
                            <div className="text-[#1D9E75] text-sm">{w.trade} · {w.city}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-sm">
                          <div className="text-[#F59E0B] font-semibold">★ {Number(w.rating).toFixed(1)}</div>
                          <div className="text-[#6B6B6B]">({w.totalJobs} jobs)</div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="px-2 py-1 bg-[#F3F3F3] rounded text-sm text-[#6B6B6B]">{w.experienceYears} yrs exp</div>
                          <div className="text-[#1D9E75] font-semibold">From Rs. {w.startingPrice}</div>
                          <div className={`ml-auto text-sm ${w.isAvailable? 'text-[#0F6E56]':'text-[#6B6B6B]'}`}>
                            <span className={`inline-block w-2 h-2 mr-2 rounded-full ${w.isAvailable? 'bg-[#0F6E56]':'bg-[#6B6B6B]'}`}></span>
                            {w.isAvailable? t('status.available') : t('status.offline')}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {w.skills.slice(0,3).map(s=> <div key={s} className="text-xs bg-[#F3F3F3] px-2 py-1 rounded">{s}</div>)}
                          {w.skills.length>3 && <div className="text-xs bg-[#F3F3F3] px-2 py-1 rounded">+{w.skills.length-3} more</div>}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <a href={`./${w.id}`} className="flex-1 text-center h-10 leading-10 border border-[#E8E8E4] rounded-md">{t('buttons.view')}</a>
                          <button className="flex-1 bg-[#1D9E75] text-white h-10 rounded-md">{t('buttons.book')}</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-center">
                <div className="text-sm text-[#6B6B6B] mb-2">{t('pagination.page_of', { page: state.page, totalPages: Math.max(1, Math.ceil(total/12)) })} · {total} {t('workers.found')}</div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>dispatch({type:'set', payload:{page: Math.max(1,state.page-1)}})} className="px-3 py-1 border rounded">{t('pagination.prev')}</button>
                  {Array.from({length: Math.min(7, Math.ceil(total/12))}).map((_,i)=>{
                    const p = i+1
                    const active = p===state.page
                    return <button key={p} onClick={()=>dispatch({type:'set', payload:{page:p}})} className={`w-8 h-8 rounded-full ${active? 'bg-[#1D9E75] text-white':'border border-[#E8E8E4]'}`}>{p}</button>
                  })}
                  <button onClick={()=>dispatch({type:'set', payload:{page: state.page+1}})} className="px-3 py-1 border rounded">{t('pagination.next')}</button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
