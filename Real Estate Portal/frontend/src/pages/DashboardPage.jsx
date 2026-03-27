import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'

const DashboardPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [properties, setProperties] = useState([])
  const [favourites, setFavourites] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const [seeding, setSeeding] = useState(false)

  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProperties(true)
      const res = await axios.get('/api/properties')
      setProperties(res.data.properties || [])
    } catch {
      toast.error('Failed to load properties.')
    } finally {
      setLoadingProperties(false)
    }
  }, [])

  const fetchFavourites = useCallback(async () => {
    try {
      const res = await axios.get('/api/favourites')
      setFavourites(res.data.favourites || [])
    } catch {
      toast.error('Failed to load favourites.')
    }
  }, [])

  useEffect(() => {
    fetchProperties()
    fetchFavourites()
  }, [fetchProperties, fetchFavourites])

  const handleToggleFavourite = async (propertyId, isCurrentlyFavourited) => {
    setTogglingId(propertyId)
    try {
      if (isCurrentlyFavourited) {
        await axios.delete(`/api/favourites/${propertyId}`)
        toast.success('Removed from favourites')
      } else {
        await axios.post(`/api/favourites/${propertyId}`)
        toast.success('Added to favourites ❤️')
      }
      await fetchProperties()
      await fetchFavourites()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await axios.post('/api/properties/seed')
      toast.success('Sample properties loaded!')
      await fetchProperties()
      await fetchFavourites()
    } catch {
      toast.error('Failed to seed properties.')
    } finally {
      setSeeding(false)
    }
  }

  const displayedProperties =
    activeTab === 'all'
      ? properties
      : (favourites || []).filter(Boolean).map((p) => ({ ...p, isFavourited: true }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-blue-100 mt-1">
                Role:{' '}
                <span className="font-semibold capitalize bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {user?.role}
                </span>
              </p>
              <p className="text-blue-100 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">{properties.length}</div>
                <div className="text-blue-100 text-xs mt-0.5">Properties</div>
              </div>
              <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-bold">{favourites.length}</div>
                <div className="text-blue-100 text-xs mt-0.5">Favourites</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Seed button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Properties
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                {properties.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('favourites')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'favourites' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill={activeTab === 'favourites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              My Favourites
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'favourites' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                {favourites.length}
              </span>
            </button>
          </div>

          {properties.length === 0 && !loadingProperties && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              {seeding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Load Sample Properties
                </>
              )}
            </button>
          )}
        </div>

        {/* Grid */}
        {loadingProperties ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'favourites' ? (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              {activeTab === 'favourites' ? 'No favourites yet' : 'No properties found'}
            </h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'favourites'
                ? 'Browse properties and click the ❤️ to save them here.'
                : 'Click "Load Sample Properties" above to get started.'}
            </p>
            {activeTab === 'favourites' && (
              <button
                onClick={() => setActiveTab('all')}
                className="mt-4 text-blue-600 font-medium hover:underline text-sm"
              >
                Browse all properties →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onToggleFavourite={handleToggleFavourite}
                loading={togglingId === property._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
