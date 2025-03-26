"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Play, Pause, SkipForward, SkipBack, Volume2, Trash } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { uploadPdf } from "@/lib/pdf-service"
import { Toaster, toast } from "sonner"

export default function ServicesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [extractedText, setExtractedText] = useState("")
  const [volume, setVolume] = useState(80)
  const [speed, setSpeed] = useState(1)
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFileReset = () => {
    setFile(null)
    setExtractedText("")
    setTotalPages(0)
    setCurrentPage(1)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Tidak ada file yang dipilih", {
        description: "Silakan pilih file PDF terlebih dahulu",
      })
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadPdf()

      if (!result?.text || !result?.totalPages) {
        throw new Error("Respon tidak valid dari server")
      }

      setExtractedText(result.text)
      setTotalPages(result.totalPages)
      setCurrentPage(1)

      toast.success("Berhasil mengunggah file", {
        description: `${file.name} telah berhasil diunggah dan diproses`,
      })
    } catch (error) {
      toast.error("Gagal mengunggah file", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat memproses file",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="flex justify-center">
      <div className="container w-full flex flex-col py-8">
        <Toaster position="top-center" />

        <div className="w-full">
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="upload" className="font-medium">Unggah Dokumen</TabsTrigger>
              <TabsTrigger value="reader" className="font-medium">Pembaca</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unggah Dokumen PDF</CardTitle>
                  <CardDescription>
                    Unggah dokumen PDF Anda untuk mulai membaca dengan bantuan teknologi Readibly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="pdf">File PDF</Label>
                      <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />
                    </div>
                    {file && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>File terpilih: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                        <Button variant="ghost" size="icon" onClick={handleFileReset}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                    {isUploading ? "Mengunggah..." : "Unggah dan Proses"}
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="reader" className="mt-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Pembaca Readibly</CardTitle>
                  <CardDescription>Baca dokumen dengan bantuan Text-to-Speech dan Eye-Tracking.</CardDescription>
                </CardHeader>
                <CardContent>
                  {extractedText ? (
                    <div className="space-y-6">
                      <div className="rounded-lg border p-4 h-64 overflow-y-auto font-dyslexic">{extractedText}</div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="eye-tracking">Eye-Tracking</Label>
                            <Switch 
                              id="eye-tracking" 
                              checked={eyeTrackingEnabled} 
                              onCheckedChange={setEyeTrackingEnabled} 
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Halaman {currentPage} dari {totalPages}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4" />
                          <Slider 
                            value={[volume]} 
                            max={100} 
                            step={1} 
                            onValueChange={(v) => setVolume(v[0])} 
                            className="w-full" 
                          />
                          <span className="w-12 text-right text-sm">{volume}%</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm">0.5x</span>
                          <Slider 
                            value={[speed]} 
                            min={0.5} 
                            max={2} 
                            step={0.1} 
                            onValueChange={(v) => setSpeed(v[0])} 
                            className="w-full" 
                          />
                          <span className="text-sm">2x</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <p className="text-muted-foreground">Belum ada dokumen yang diunggah</p>
                      <Button variant="outline" onClick={() => document.getElementById("pdf")?.click()}>
                        Pilih Dokumen
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevPage} disabled={currentPage <= 1}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={togglePlayPause}>
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" /> Jeda
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> Putar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleNextPage} disabled={currentPage >= totalPages}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}