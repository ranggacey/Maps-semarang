/**
 * Spotify Web API client
 * 
 * This module provides functions to interact with the Spotify Web API
 * https://developer.spotify.com/documentation/web-api
 */

const BASE_URL = 'https://api.spotify.com/v1';

/**
 * Get the current user's profile
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object>} - User profile data
 */
export async function getCurrentUserProfile(accessToken) {
  return await fetchFromSpotify('/me', accessToken);
}

/**
 * Get the current user's playlists
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Maximum number of playlists to return (default: 20, max: 50)
 * @param {number} offset - Index of the first playlist to return (default: 0)
 * @returns {Promise<Object>} - User playlists data
 */
export async function getCurrentUserPlaylists(accessToken, limit = 20, offset = 0) {
  return await fetchFromSpotify(`/me/playlists?limit=${limit}&offset=${offset}`, accessToken);
}

/**
 * Get a specific playlist
 * @param {string} accessToken - Spotify access token
 * @param {string} playlistId - Spotify playlist ID
 * @returns {Promise<Object>} - Playlist data
 */
export async function getPlaylist(accessToken, playlistId) {
  return await fetchFromSpotify(`/playlists/${playlistId}`, accessToken);
}

/**
 * Get a playlist's tracks
 * @param {string} accessToken - Spotify access token
 * @param {string} playlistId - Spotify playlist ID
 * @param {number} limit - Maximum number of tracks to return (default: 100, max: 100)
 * @param {number} offset - Index of the first track to return (default: 0)
 * @returns {Promise<Object>} - Playlist tracks data
 */
export async function getPlaylistTracks(accessToken, playlistId, limit = 100, offset = 0) {
  return await fetchFromSpotify(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, accessToken);
}

/**
 * Create a playlist
 * @param {string} accessToken - Spotify access token
 * @param {string} userId - Spotify user ID
 * @param {string} name - Playlist name
 * @param {string} description - Playlist description
 * @param {boolean} isPublic - Whether the playlist is public (default: true)
 * @returns {Promise<Object>} - Created playlist data
 */
export async function createPlaylist(accessToken, userId, name, description, isPublic = true) {
  return await fetchFromSpotify(`/users/${userId}/playlists`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      public: isPublic
    })
  });
}

/**
 * Add tracks to a playlist
 * @param {string} accessToken - Spotify access token
 * @param {string} playlistId - Spotify playlist ID
 * @param {string[]} uris - Array of Spotify track URIs
 * @returns {Promise<Object>} - Response data
 */
export async function addTracksToPlaylist(accessToken, playlistId, uris) {
  return await fetchFromSpotify(`/playlists/${playlistId}/tracks`, accessToken, {
    method: 'POST',
    body: JSON.stringify({ uris })
  });
}

/**
 * Get the current user's saved tracks
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Maximum number of tracks to return (default: 20, max: 50)
 * @param {number} offset - Index of the first track to return (default: 0)
 * @returns {Promise<Object>} - User's saved tracks data
 */
export async function getSavedTracks(accessToken, limit = 20, offset = 0) {
  return await fetchFromSpotify(`/me/tracks?limit=${limit}&offset=${offset}`, accessToken);
}

/**
 * Get the current user's top artists
 * @param {string} accessToken - Spotify access token
 * @param {string} timeRange - Over what time frame the affinities are computed (short_term, medium_term, long_term)
 * @param {number} limit - Maximum number of artists to return (default: 20, max: 50)
 * @param {number} offset - Index of the first artist to return (default: 0)
 * @returns {Promise<Object>} - User's top artists data
 */
export async function getTopArtists(accessToken, timeRange = 'medium_term', limit = 20, offset = 0) {
  return await fetchFromSpotify(`/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`, accessToken);
}

/**
 * Get the current user's top tracks
 * @param {string} accessToken - Spotify access token
 * @param {string} timeRange - Over what time frame the affinities are computed (short_term, medium_term, long_term)
 * @param {number} limit - Maximum number of tracks to return (default: 20, max: 50)
 * @param {number} offset - Index of the first track to return (default: 0)
 * @returns {Promise<Object>} - User's top tracks data
 */
export async function getTopTracks(accessToken, timeRange = 'medium_term', limit = 20, offset = 0) {
  return await fetchFromSpotify(`/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`, accessToken);
}

/**
 * Get the current user's recently played tracks
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Maximum number of tracks to return (default: 20, max: 50)
 * @param {number} after - Unix timestamp in milliseconds to get tracks after this time
 * @param {number} before - Unix timestamp in milliseconds to get tracks before this time
 * @returns {Promise<Object>} - User's recently played tracks data
 */
export async function getRecentlyPlayedTracks(accessToken, limit = 20, after = null, before = null) {
  let url = `/me/player/recently-played?limit=${limit}`;
  if (after) url += `&after=${after}`;
  if (before) url += `&before=${before}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get featured playlists
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Maximum number of playlists to return (default: 20, max: 50)
 * @param {number} offset - Index of the first playlist to return (default: 0)
 * @param {string} country - ISO 3166-1 alpha-2 country code (default: user's country)
 * @param {string} locale - Language and country code (default: en_US)
 * @returns {Promise<Object>} - Featured playlists data
 */
export async function getFeaturedPlaylists(accessToken, limit = 20, offset = 0, country = null, locale = null) {
  let url = `/browse/featured-playlists?limit=${limit}&offset=${offset}`;
  if (country) url += `&country=${country}`;
  if (locale) url += `&locale=${locale}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get new releases
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Maximum number of albums to return (default: 20, max: 50)
 * @param {number} offset - Index of the first album to return (default: 0)
 * @param {string} country - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - New releases data
 */
export async function getNewReleases(accessToken, limit = 20, offset = 0, country = null) {
  let url = `/browse/new-releases?limit=${limit}&offset=${offset}`;
  if (country) url += `&country=${country}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get recommendations based on seeds
 * @param {string} accessToken - Spotify access token
 * @param {object} options - Options for recommendations
 * @param {string[]} options.seedArtists - Array of Spotify artist IDs (max: 5 total seeds)
 * @param {string[]} options.seedTracks - Array of Spotify track IDs (max: 5 total seeds)
 * @param {string[]} options.seedGenres - Array of Spotify genre IDs (max: 5 total seeds)
 * @param {number} options.limit - Maximum number of tracks to return (default: 20, max: 100)
 * @param {object} options.minMaxValues - Min/max values for audio features
 * @returns {Promise<Object>} - Recommendations data
 */
export async function getRecommendations(accessToken, options) {
  const { seedArtists = [], seedTracks = [], seedGenres = [], limit = 20, minMaxValues = {} } = options;
  
  let url = `/recommendations?limit=${limit}`;
  
  if (seedArtists.length > 0) {
    url += `&seed_artists=${seedArtists.join(',')}`;
  }
  
  if (seedTracks.length > 0) {
    url += `&seed_tracks=${seedTracks.join(',')}`;
  }
  
  if (seedGenres.length > 0) {
    url += `&seed_genres=${seedGenres.join(',')}`;
  }
  
  // Add min/max values for audio features
  Object.entries(minMaxValues).forEach(([key, value]) => {
    url += `&${key}=${value}`;
  });
  
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Search for items
 * @param {string} accessToken - Spotify access token
 * @param {string} query - Search query
 * @param {string[]} types - Array of item types to search for (album, artist, playlist, track, show, episode, audiobook)
 * @param {number} limit - Maximum number of items to return per type (default: 20, max: 50)
 * @param {number} offset - Index of the first item to return (default: 0)
 * @param {string} market - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - Search results data
 */
export async function search(accessToken, query, types = ['track', 'artist', 'album', 'playlist'], limit = 20, offset = 0, market = null) {
  const typesString = types.join(',');
  let url = `/search?q=${encodeURIComponent(query)}&type=${typesString}&limit=${limit}&offset=${offset}`;
  if (market) url += `&market=${market}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get an artist
 * @param {string} accessToken - Spotify access token
 * @param {string} artistId - Spotify artist ID
 * @returns {Promise<Object>} - Artist data
 */
export async function getArtist(accessToken, artistId) {
  return await fetchFromSpotify(`/artists/${artistId}`, accessToken);
}

/**
 * Get an artist's albums
 * @param {string} accessToken - Spotify access token
 * @param {string} artistId - Spotify artist ID
 * @param {string} includeGroups - Album types to include (album, single, appears_on, compilation)
 * @param {number} limit - Maximum number of albums to return (default: 20, max: 50)
 * @param {number} offset - Index of the first album to return (default: 0)
 * @param {string} market - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - Artist's albums data
 */
export async function getArtistAlbums(accessToken, artistId, includeGroups = null, limit = 20, offset = 0, market = null) {
  let url = `/artists/${artistId}/albums?limit=${limit}&offset=${offset}`;
  if (includeGroups) url += `&include_groups=${includeGroups}`;
  if (market) url += `&market=${market}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get an artist's top tracks
 * @param {string} accessToken - Spotify access token
 * @param {string} artistId - Spotify artist ID
 * @param {string} market - ISO 3166-1 alpha-2 country code (required)
 * @returns {Promise<Object>} - Artist's top tracks data
 */
export async function getArtistTopTracks(accessToken, artistId, market = 'US') {
  return await fetchFromSpotify(`/artists/${artistId}/top-tracks?market=${market}`, accessToken);
}

/**
 * Get an album
 * @param {string} accessToken - Spotify access token
 * @param {string} albumId - Spotify album ID
 * @param {string} market - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - Album data
 */
export async function getAlbum(accessToken, albumId, market = null) {
  let url = `/albums/${albumId}`;
  if (market) url += `?market=${market}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get an album's tracks
 * @param {string} accessToken - Spotify access token
 * @param {string} albumId - Spotify album ID
 * @param {number} limit - Maximum number of tracks to return (default: 50, max: 50)
 * @param {number} offset - Index of the first track to return (default: 0)
 * @param {string} market - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - Album tracks data
 */
export async function getAlbumTracks(accessToken, albumId, limit = 50, offset = 0, market = null) {
  let url = `/albums/${albumId}/tracks?limit=${limit}&offset=${offset}`;
  if (market) url += `&market=${market}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get a track
 * @param {string} accessToken - Spotify access token
 * @param {string} trackId - Spotify track ID
 * @param {string} market - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - Track data
 */
export async function getTrack(accessToken, trackId, market = null) {
  let url = `/tracks/${trackId}`;
  if (market) url += `?market=${market}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get audio features for a track
 * @param {string} accessToken - Spotify access token
 * @param {string} trackId - Spotify track ID
 * @returns {Promise<Object>} - Audio features data
 */
export async function getAudioFeatures(accessToken, trackId) {
  return await fetchFromSpotify(`/audio-features/${trackId}`, accessToken);
}

/**
 * Get several audio features for multiple tracks
 * @param {string} accessToken - Spotify access token
 * @param {string[]} trackIds - Array of Spotify track IDs (max: 100)
 * @returns {Promise<Object>} - Audio features data
 */
export async function getAudioFeaturesForTracks(accessToken, trackIds) {
  return await fetchFromSpotify(`/audio-features?ids=${trackIds.join(',')}`, accessToken);
}

/**
 * Get categories
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Maximum number of categories to return (default: 20, max: 50)
 * @param {number} offset - Index of the first category to return (default: 0)
 * @param {string} country - ISO 3166-1 alpha-2 country code (default: user's country)
 * @param {string} locale - Language and country code (default: en_US)
 * @returns {Promise<Object>} - Categories data
 */
export async function getCategories(accessToken, limit = 20, offset = 0, country = null, locale = null) {
  let url = `/browse/categories?limit=${limit}&offset=${offset}`;
  if (country) url += `&country=${country}`;
  if (locale) url += `&locale=${locale}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get a category
 * @param {string} accessToken - Spotify access token
 * @param {string} categoryId - Spotify category ID
 * @param {string} country - ISO 3166-1 alpha-2 country code (default: user's country)
 * @param {string} locale - Language and country code (default: en_US)
 * @returns {Promise<Object>} - Category data
 */
export async function getCategory(accessToken, categoryId, country = null, locale = null) {
  let url = `/browse/categories/${categoryId}`;
  const params = [];
  if (country) params.push(`country=${country}`);
  if (locale) params.push(`locale=${locale}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Get a category's playlists
 * @param {string} accessToken - Spotify access token
 * @param {string} categoryId - Spotify category ID
 * @param {number} limit - Maximum number of playlists to return (default: 20, max: 50)
 * @param {number} offset - Index of the first playlist to return (default: 0)
 * @param {string} country - ISO 3166-1 alpha-2 country code (default: user's country)
 * @returns {Promise<Object>} - Category playlists data
 */
export async function getCategoryPlaylists(accessToken, categoryId, limit = 20, offset = 0, country = null) {
  let url = `/browse/categories/${categoryId}/playlists?limit=${limit}&offset=${offset}`;
  if (country) url += `&country=${country}`;
  return await fetchFromSpotify(url, accessToken);
}

/**
 * Helper function to make requests to the Spotify API
 * @param {string} endpoint - API endpoint
 * @param {string} accessToken - Spotify access token
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
async function fetchFromSpotify(endpoint, accessToken, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      headers,
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP error ${response.status}`);
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error('Spotify API error:', error);
    throw error;
  }
}
