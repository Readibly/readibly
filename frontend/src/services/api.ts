const API_BASE_URL = 'https://localhost:8000';

// Auth interfaces
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface PDFResponse {
  status: string;
  text: string;
  words: string[];
  pageCount: number;
}

export interface GazeData {
  timestamp: number;
  gaze_direction: number[];
}

export interface TextData {
  text: string[];
  positions: { x: number; y: number }[];
}

export const api = {
  // Authentication
  register: async (data: RegisterRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      // Store token in localStorage for subsequent requests
      localStorage.setItem('auth_token', data.access_token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
  },

  // Helper function to add auth headers
  getAuthHeaders: (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  // PDF Upload and Parsing
  uploadPDF: async (file: File): Promise<PDFResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          ...api.getAuthHeaders()
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload PDF');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Eye Tracking
  async startEyeTracking(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/start-eye-tracking`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...this.getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to start eye tracking');
    }
  },

  async stopEyeTracking(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/stop-eye-tracking`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...this.getAuthHeaders()
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to stop eye tracking');
    }
  },

  // Text to Speech
  convertToSpeech: async (text: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...api.getAuthHeaders()
        },
        body: JSON.stringify({ text }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Text-to-speech failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.audio_path;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw error;
    }
  },

  // Set Text Data for Eye Tracking
  setTextData: async (data: TextData): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/set-text-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...api.getAuthHeaders()
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to set text data: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error setting text data:', error);
      throw error;
    }
  },
};