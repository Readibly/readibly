// Simulasi layanan untuk eye-tracking

interface EyePosition {
    x: number
    y: number
    timestamp: number
  }
  
  export class EyeTrackingService {
    private isTracking = false
    private positions: EyePosition[] = []
    private callback: ((position: EyePosition) => void) | null = null
    private webcamStream: MediaStream | null = null
    private trackingInterval: NodeJS.Timeout | null = null
  
    // Memulai pelacakan mata
    async startTracking(callback: (position: EyePosition) => void): Promise<boolean> {
      if (this.isTracking) return true
  
      this.callback = callback
  
      try {
        // Dalam implementasi nyata, ini akan menggunakan webcam dan model ML untuk eye-tracking
        // Untuk simulasi, kita akan menggunakan mouse position sebagai pengganti
  
        // Minta izin webcam (untuk simulasi)
        this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true })
  
        // Simulasi pelacakan mata dengan mouse movement
        document.addEventListener("mousemove", this.handleMouseMove)
  
        // Simulasi pemrosesan data eye-tracking
        this.trackingInterval = setInterval(() => {
          this.processEyeData()
        }, 100)
  
        this.isTracking = true
        return true
      } catch (error) {
        console.error("Error starting eye tracking:", error)
        return false
      }
    }
  
    // Menghentikan pelacakan mata
    stopTracking(): void {
      if (!this.isTracking) return
  
      document.removeEventListener("mousemove", this.handleMouseMove)
  
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval)
        this.trackingInterval = null
      }
  
      if (this.webcamStream) {
        this.webcamStream.getTracks().forEach((track) => track.stop())
        this.webcamStream = null
      }
  
      this.positions = []
      this.isTracking = false
    }
  
    // Handler untuk mouse movement (simulasi eye tracking)
    private handleMouseMove = (event: MouseEvent): void => {
      this.positions.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
      })
  
      // Batasi jumlah posisi yang disimpan
      if (this.positions.length > 30) {
        this.positions.shift()
      }
    }
  
    // Proses data eye-tracking untuk menentukan kecepatan baca
    private processEyeData(): void {
      if (this.positions.length < 2 || !this.callback) return
  
      // Ambil posisi terbaru
      const latestPosition = this.positions[this.positions.length - 1]
  
      // Panggil callback dengan posisi terbaru
      this.callback(latestPosition)
    }
  
    // Hitung kecepatan baca berdasarkan pergerakan mata
    calculateReadingSpeed(): number {
      if (this.positions.length < 10) return 1.0 // Default speed
  
      // Dalam implementasi nyata, ini akan menganalisis pola gerakan mata
      // untuk menentukan kecepatan baca yang optimal
  
      // Simulasi: hitung rata-rata pergerakan horizontal
      let totalHorizontalMovement = 0
  
      for (let i = 1; i < this.positions.length; i++) {
        const prev = this.positions[i - 1]
        const curr = this.positions[i]
  
        // Hitung jarak horizontal
        const horizontalDistance = Math.abs(curr.x - prev.x)
        totalHorizontalMovement += horizontalDistance
      }
  
      const avgMovement = totalHorizontalMovement / (this.positions.length - 1)
  
      // Konversi ke kecepatan baca (0.5 - 2.0)
      // Gerakan cepat = pembaca cepat, gerakan lambat = pembaca lambat
      const speed = Math.max(0.5, Math.min(2.0, avgMovement / 100))
  
      return speed
    }
  }
  
  export const eyeTrackingService = new EyeTrackingService()
  
  