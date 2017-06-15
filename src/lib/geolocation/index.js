import geolib from 'geolib'

const COORD_LAT_CITY_CENTER = 51
const COORD_LON_CITY_CENTER = 20

export const COORD_CITY_CENTER = {
  lat: COORD_LAT_CITY_CENTER,
  lon: COORD_LON_CITY_CENTER
}

/**
 * Check whether a given pair of lat/lon coordinates is within 50km radius
 * from city center.
 *
 * @param  {Number}  lat Latitude
 * @param  {Number}  lon Longitude
 * @return {Boolean}
 */
export function isWithinBoundaries (lat, lon) {
  return geolib.isPointInCircle(
    { latitude: COORD_LAT_CITY_CENTER, longitude: COORD_LON_CITY_CENTER },
    { latitude: lat, longitude: lon },
    50000
  )
}
