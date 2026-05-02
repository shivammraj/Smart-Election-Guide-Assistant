import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FiMapPin, FiNavigation, FiShare2, FiLoader } from 'react-icons/fi'
import locationService from '../services/locationService'

const BoothFinderScreen = () => {
  const { t } = useTranslation()
  const [booths, setBooths] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [manualAddress, setManualAddress] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)

  const handleFindBooth = async () => {
    try {
      setLoading(true)
      setError('')
      const location = await locationService.getLocation()
      setUserLocation(location)

      const nearbyBooths = await locationService.findNearbyBooths(
        location.lat,
        location.lng,
        5
      )
      setBooths(nearbyBooths)
    } catch (err) {
      setError(err.message || t('booth_finder.gps_denied'))
      setShowManualEntry(true)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSearch = async () => {
    if (!manualAddress.trim()) {
      setError(t('onboarding.error_field'))
      return
    }

    try {
      setLoading(true)
      setError('')
      const geocoded = await locationService.geocodeAddress(manualAddress)
      setUserLocation(geocoded)

      const nearbyBooths = await locationService.findNearbyBooths(
        geocoded.lat,
        geocoded.lng,
        5
      )
      setBooths(nearbyBooths)
      setShowManualEntry(false)
    } catch (err) {
      setError(t('booth_finder.map_error'))
    } finally {
      setLoading(false)
    }
  }

  const getDirections = (booth) => {
    const url = locationService.getDirectionsUrl(booth.address)
    window.open(url, '_blank')
  }

  const shareLocation = (booth) => {
    const message = t('booth_finder.share_message', {
      name: booth.name,
      address: booth.address,
    })
    if (navigator.share) {
      navigator.share({
        title: 'My Polling Booth',
        text: message,
      })
    } else {
      alert(message)
    }
  }

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary-500">
            {t('booth_finder.title')}
          </h1>
          <p className="text-gray-600 mt-2">{t('booth_finder.subtitle')}</p>
        </div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-4 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Find Booth Button */}
        {!userLocation && !showManualEntry && (
          <motion.button
            variants={itemVariants}
            onClick={handleFindBooth}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                {t('booth_finder.searching')}
              </>
            ) : (
              <>
                <FiMapPin />
                {t('booth_finder.find_button')}
              </>
            )}
          </motion.button>
        )}

        {/* Manual Entry Form */}
        {showManualEntry && (
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {t('booth_finder.manual_address')}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder={t('booth_finder.address_placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleManualSearch}
                disabled={loading}
                className="px-4 py-2 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('booth_finder.manual_search')}
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="p-4 bg-red-100 border border-red-500 text-red-800 rounded-lg"
          >
            {error}
            {error.includes('GPS') && (
              <button
                onClick={() => setShowManualEntry(true)}
                className="block mt-2 font-bold text-red-900 hover:underline"
              >
                {t('booth_finder.try_manual')}
              </button>
            )}
          </motion.div>
        )}

        {/* Booths List */}
        {booths.length > 0 && (
          <>
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-600 font-medium">
                {t('booth_finder.results_count', { count: booths.length })}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {booths.map((booth) => (
                <motion.div
                  key={booth.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition"
                >
                  {/* Booth Name & Details */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {booth.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-start gap-2">
                      <FiMapPin className="mt-0.5 flex-shrink-0" />
                      {booth.address}
                    </p>
                  </div>

                  {/* Distance & Time */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">
                        {t('booth_finder.distance')}
                      </p>
                      <p className="font-bold text-primary-500">
                        {t('booth_finder.meters', {
                          distance: booth.distance,
                        })}
                      </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">
                        {t('booth_finder.walk_time')}
                      </p>
                      <p className="font-bold text-accent-500">
                        {t('booth_finder.walk_minutes', {
                          minutes: booth.walkTime,
                        })}
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${getCrowdColor(booth.crowdLevel)}`}>
                      <p className="text-xs">
                        {t('booth_finder.crowd_level')}
                      </p>
                      <p className="font-bold">
                        {t(`booth_finder.${booth.crowdLevel}`)}
                      </p>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-700">
                    {t('booth_finder.timing')}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => getDirections(booth)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition"
                    >
                      <FiNavigation /> {t('booth_finder.directions')}
                    </button>
                    <button
                      onClick={() => shareLocation(booth)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-accent-500 text-accent-500 font-bold rounded-lg hover:bg-accent-50 transition"
                    >
                      <FiShare2 /> {t('common.share')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* No Results */}
        {booths.length === 0 && !loading && userLocation && (
          <motion.div
            variants={itemVariants}
            className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200"
          >
            <p className="text-gray-700">{t('booth_finder.no_results')}</p>
            <p className="text-sm text-gray-600 mt-2">
              {t('booth_finder.no_results_desc')}
            </p>
            <button
              onClick={() => {
                setUserLocation(null)
                setBooths([])
              }}
              className="mt-4 px-4 py-2 bg-primary-500 text-white font-bold rounded-lg"
            >
              {t('common.retry')}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default BoothFinderScreen
