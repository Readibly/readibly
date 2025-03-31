import cv2
import numpy as np
import logging
from typing import List, Dict, Tuple

logger = logging.getLogger(__name__)

class EyeTracker:
    def __init__(self):
        self.is_tracking = False
        self.cap = None
        self.text_data = None
        self.word_positions = None
        self.current_word = None
        self.gaze_data = []

    def start_tracking(self):
        """Start eye tracking"""
        try:
            self.is_tracking = True
            logger.info("Eye tracking started successfully")
        except Exception as e:
            logger.error(f"Error starting eye tracking: {str(e)}")
            raise

    def stop_tracking(self):
        """Stop eye tracking"""
        try:
            self.is_tracking = False
            logger.info("Eye tracking stopped successfully")
        except Exception as e:
            logger.error(f"Error stopping eye tracking: {str(e)}")
            raise

    def set_text_data(self, text: List[str], positions: List[Dict[str, float]]):
        """Set the text data and word positions for tracking"""
        self.text_data = text
        self.word_positions = positions
        logger.info(f"Text data set with {len(text)} words")

    def update_gaze_position(self, x: float, y: float):
        """Update gaze position and find current word"""
        if not self.is_tracking or not self.word_positions:
            return None

        try:
            # Find closest word
            closest_word = None
            min_distance = float('inf')
            
            for i, pos in enumerate(self.word_positions):
                distance = np.sqrt(
                    (pos['x'] - x)**2 + 
                    (pos['y'] - y)**2
                )
                if distance < min_distance:
                    min_distance = distance
                    closest_word = self.text_data[i]
            
            # Only return word if gaze is close enough
            if min_distance < 0.1:
                self.current_word = closest_word
                return closest_word
            else:
                self.current_word = None
                return None
                
        except Exception as e:
            logger.error(f"Error updating gaze position: {str(e)}")
            return None

    def get_current_word(self) -> str:
        """Get the current word being looked at"""
        return self.current_word 