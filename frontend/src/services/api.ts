const API_BASE_URL = 'https://localhost:8000';

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
  // PDF Upload and Parsing
  uploadPDF: async (file: File): Promise<PDFResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
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