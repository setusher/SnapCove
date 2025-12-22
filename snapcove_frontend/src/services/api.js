import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup/', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  googleAuth: async (idToken) => {
    const response = await api.post('/auth/google/', { id_token: idToken });
    return response.data;
  },
};

// Events API functions
export const eventsAPI = {
  getEvents: async (searchQuery = '') => {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await api.get('/events/', { params });
    // Handle paginated response
    return response.data.results || response.data;
  },

  getEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}/`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events/', eventData);
    return response.data;
  },
};

// Albums API functions
export const albumsAPI = {
  getAlbums: async (eventId, searchQuery = '') => {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await api.get(`/events/${eventId}/albums/`, { params });
    // Handle paginated response
    return response.data.results || response.data;
  },

  getAlbum: async (eventId, albumId) => {
    const response = await api.get(`/events/${eventId}/albums/${albumId}/`);
    return response.data;
  },

  createAlbum: async (eventId, albumData) => {
    const response = await api.post(`/events/${eventId}/albums/`, albumData);
    return response.data;
  },
};

// Photos API functions
export const photosAPI = {
  getPhotos: async (eventId, albumId, searchQuery = '') => {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await api.get(`/events/${eventId}/albums/${albumId}/photos/`, { params });
    // Handle paginated response
    return response.data.results || response.data;
  },

  getPhoto: async (eventId, albumId, photoId) => {
    const response = await api.get(`/events/${eventId}/albums/${albumId}/photos/${photoId}/`);
    return response.data;
  },

  uploadPhoto: async (eventId, albumId, photoData) => {
    const formData = new FormData();
    Object.keys(photoData).forEach(key => {
      formData.append(key, photoData[key]);
    });
    const response = await api.post(`/events/${eventId}/albums/${albumId}/photos/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Interactions API functions
export const interactionsAPI = {
  toggleLike: async (photoId) => {
    const response = await api.post(`/photos/${photoId}/like/`);
    return response.data;
  },

  getComments: async (photoId) => {
    const response = await api.get(`/photos/${photoId}/comments/`);
    return response.data;
  },

  createComment: async (photoId, content) => {
    const response = await api.post(`/photos/${photoId}/comments/`, { content });
    return response.data;
  },

  replyToComment: async (commentId, content) => {
    const response = await api.post(`/comments/${commentId}/reply/`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}/delete/`);
    return response.data;
  },
};

export default api;

