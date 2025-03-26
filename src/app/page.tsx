import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Headphones, BookOpen } from "lucide-react";

export default function Home() {
  return (
    // hero section
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-18 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 pl-26">
              <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-7xl text-purple-700">
                Membaca Lebih Mudah Untuk Semua
              </h1>
              <p className = "text-muted-foreground font-normal med:text-xl text-gray-600">
                Readibly membantu penyandang disleksia membaca dengan lebih mudah menggunakan teknologi eye-tracking dan Text-to-Speech yang adaptif
              </p>
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <Link href="/services">
                  <Button className="bg-purple-600 hover:bg-purple-500">
                    Mulai Membaca <ArrowRight className="ml-2 h-4">
                    </ArrowRight>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="border bg-white text-primary hover:bg-purple-50">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[800px] lg:h-[400px] rounded-xl overflow-hidden">
              <Image src="/img/P_Hero.png" alt="hero" layout="fill" objectFit="cover" priority>              
              </Image>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-12 md:py-24 bg-purple-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800">
                Fitur Utama
              </h2>
              <p className="max-w-[700px] text-muted-foreground font-normal text-xl gap-8">
                Teknologi yang membantu penyandang disleksia membaca dengan lebih mudah dan nyaman.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max -w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-xl bg-white">
              <div className="rounded-full bg-primary/2 p-3">
                <Eye className="h-8 w-8 text-purple-600"></Eye>
              </div>
              <h3 className="text-3xl font-bold text-purple-600">
                Eye-Tracking
              </h3>
              <p className="text-center text-muted-foreground">
                <span className="text-blue-400">Teknologi</span>
                <span> yang melacak gerakan</span>
                <span className="text-blue-400"> mata</span>
                <span> untuk menyesuaikan kecepatan membaca.</span>
              </p>
            </div> 
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-xl bg-white">
              <div className="rounded-full bg-primary/2 p-3">
                <Headphones className="h-8 w-8 text-purple-600"></Headphones>
              </div>
              <h3 className="text-3xl font-bold text-purple-600">
                Text-to-Speech
              </h3>
              <p className="text-center text-muted-foreground">
                <span>Mengubah</span>
                <span className="text-blue-400"> teks</span>
                <span> menjadi</span>
                <span className="text-blue-400"> suara</span>
                <span> dengan kualitas tinggi untuk membantu pemahaman.</span>
                  
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-xl bg-white">
              <div className="rounded-full bg-primary/2 p-3">
                <BookOpen className="h-8 w-8 text-purple-600"></BookOpen>
              </div>
              <h3 className="text-3xl font-bold text-purple-600">
                Disleksia Friendly
              </h3>
              <p className="text-center text-muted-foreground">
                <span>Menggunakan font</span>
                <span className="text-blue-400"> OpenDyslexic</span>
                <span> dan</span>
                <span className="text-blue-400"> warna</span>
                <span> yang ramah untuk penyandang disleksia.</span>  
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
