import axios from "axios";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

/**
 * Creates an axios instance with authentication headers
 */
export const spotifyApi = (accessToken) => {
  return axios.create({
    baseURL: SPOTIFY_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

/**
 * Get current user's profile
 */
export const getCurrentUserProfile = async (accessToken) => {
  try {
    const response = await spotifyApi(accessToken).get("/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Get user's playlists
 */
export const getUserPlaylists = async (accessToken) => {
  try {
    const response = await spotifyApi(accessToken).get("/me/playlists");
    return response.data;
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw error;
  }
};

/**
 * Get a playlist by ID
 */
export const getPlaylist = async (accessToken, playlistId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/playlists/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
};

/**
 * Get user's saved tracks
 */
export const getSavedTracks = async (accessToken, limit = 20, offset = 0) => {
  try {
    const response = await spotifyApi(accessToken).get("/me/tracks", {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching saved tracks:", error);
    throw error;
  }
};

/**
 * Get new releases
 */
export const getNewReleases = async (accessToken, limit = 20, offset = 0) => {
  try {
    const response = await spotifyApi(accessToken).get("/browse/new-releases", {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching new releases:", error);
    throw error;
  }
};

/**
 * Get featured playlists
 */
export const getFeaturedPlaylists = async (accessToken, limit = 20, offset = 0) => {
  try {
    const response = await spotifyApi(accessToken).get("/browse/featured-playlists", {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching featured playlists:", error);
    throw error;
  }
};

/**
 * Search for items
 */
export const search = async (accessToken, query, types = ["track", "artist", "album", "playlist"], limit = 20) => {
  try {
    const response = await spotifyApi(accessToken).get("/search", {
      params: {
        q: query,
        type: types.join(","),
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

/**
 * Get artist
 */
export const getArtist = async (accessToken, artistId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/artists/${artistId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching artist:", error);
    throw error;
  }
};

/**
 * Get artist's top tracks
 */
export const getArtistTopTracks = async (accessToken, artistId, market = "US") => {
  try {
    const response = await spotifyApi(accessToken).get(`/artists/${artistId}/top-tracks`, {
      params: { market },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching artist top tracks:", error);
    throw error;
  }
};

/**
 * Get artist's albums
 */
export const getArtistAlbums = async (accessToken, artistId, limit = 20, offset = 0) => {
  try {
    const response = await spotifyApi(accessToken).get(`/artists/${artistId}/albums`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    throw error;
  }
};

/**
 * Get artist's related artists
 */
export const getArtistRelatedArtists = async (accessToken, artistId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/artists/${artistId}/related-artists`);
    return response.data;
  } catch (error) {
    console.error("Error fetching related artists:", error);
    throw error;
  }
};

/**
 * Get album
 */
export const getAlbum = async (accessToken, albumId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching album:", error);
    throw error;
  }
};

/**
 * Get track
 */
export const getTrack = async (accessToken, trackId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/tracks/${trackId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching track:", error);
    throw error;
  }
};

/**
 * Get track's audio features
 */
export const getTrackAudioFeatures = async (accessToken, trackId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/audio-features/${trackId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching track audio features:", error);
    throw error;
  }
};

/**
 * Get track's audio analysis
 */
export const getTrackAudioAnalysis = async (accessToken, trackId) => {
  try {
    const response = await spotifyApi(accessToken).get(`/audio-analysis/${trackId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching track audio analysis:", error);
    throw error;
  }
};

/**
 * Get recommendations based on seeds
 */
export const getRecommendations = async (accessToken, options) => {
  try {
    const response = await spotifyApi(accessToken).get('/recommendations', {
      params: options
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

/**
 * Get available genre seeds
 */
export const getAvailableGenreSeeds = async (accessToken) => {
  try {
    const response = await spotifyApi(accessToken).get('/recommendations/available-genre-seeds');
    return response.data;
  } catch (error) {
    console.error("Error fetching genre seeds:", error);
    throw error;
  }
};

/**
 * Get user's top items
 */
export const getUserTopItems = async (accessToken, type, timeRange = 'medium_term', limit = 20, offset = 0) => {
  try {
    const response = await spotifyApi(accessToken).get(`/me/top/${type}`, {
      params: { time_range: timeRange, limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user's top ${type}:`, error);
    throw error;
  }
};

/**
 * Get several browse categories
 */
export const getBrowseCategories = async (accessToken, limit = 20, offset = 0, country, locale) => {
  try {
    const params = { limit, offset };
    if (country) params.country = country;
    if (locale) params.locale = locale;
    
    const response = await spotifyApi(accessToken).get('/browse/categories', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching browse categories:", error);
    throw error;
  }
};

/**
 * Get a single browse category
 */
export const getBrowseCategory = async (accessToken, categoryId, country, locale) => {
  try {
    const params = {};
    if (country) params.country = country;
    if (locale) params.locale = locale;
    
    const response = await spotifyApi(accessToken).get(`/browse/categories/${categoryId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching browse category:", error);
    throw error;
  }
};

/**
 * Get a category's playlists
 */
export const getCategoryPlaylists = async (accessToken, categoryId, limit = 20, offset = 0, country) => {
  try {
    const params = { limit, offset };
    if (country) params.country = country;
    
    const response = await spotifyApi(accessToken).get(`/browse/categories/${categoryId}/playlists`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching category playlists:", error);
    throw error;
  }
};
