const locationService = {
  async getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          reject(new Error(`GPS Error: ${error.message}`))
        }
      )
    })
  },

  async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.results.length === 0) {
        throw new Error('Address not found')
      }

      const location = data.results[0].geometry.location
      return {
        lat: location.lat,
        lng: location.lng,
        address: data.results[0].formatted_address,
      }
    } catch (error) {
      throw new Error(`Geocoding error: ${error.message}`)
    }
  },

  async findNearbyBooths(lat, lng, radiusKm = 5) {
    try {
      // Using Google Places API to find nearby government buildings, community centers
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusKm * 1000}&type=civic_center|government_office|community_center&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.results.length === 0) {
        throw new Error('No polling booths found nearby')
      }

      // Mock data for crowd levels since we don't have real-time data
      const crowdLevels = ['low', 'medium', 'high']

      return data.results.slice(0, 5).map((place, idx) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        distance: this.calculateDistance(
          lat,
          lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
        walkTime: Math.ceil(
          (this.calculateDistance(
            lat,
            lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          ) /
            1000) *
            12
        ), // ~5km/hour walking speed
        crowdLevel: crowdLevels[idx % 3],
      }))
    } catch (error) {
      throw new Error(`Places API error: ${error.message}`)
    }
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance in meters
    const R = 6371000 // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
  },

  getDirectionsUrl(address) {
    return `https://www.google.com/maps/search/${encodeURIComponent(address)}`
  },

  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(1)} km`
  },
}

export default locationService
