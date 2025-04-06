declare module 'webgazer' {
  interface GazeData {
    x: number;
    y: number;
    pupilDiameter: number;
  }

  interface WebGazer {
    setGazeListener(callback: (data: GazeData | null) => void): WebGazer;
    begin(): void;
    end(): void;
    setTracker(tracker: string): void;
    showVideo(show: boolean): void;
    showFaceOverlay(show: boolean): void;
    showFaceFeedbackBox(show: boolean): void;
    showPredictionPoints(show: boolean): void;
    showCalibration(show: boolean): Promise<void>;
  }

  const webgazer: WebGazer;
  export default webgazer;
} 