import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Headphones, BookOpen } from "lucide-react";

export default function Home() {
  return (
    // hero section
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-18 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 pl-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-800">
                Membaca Lebih Mudah Untuk Semua
              </h1>
              <p className = "text-muted-foreground font-normal med:text-xl text-gray-600">
                Readibly membantu penyandang disleksia membaca dengan lebih mudah menggunakan teknologi eye-tracking dan Text-to-Speech yang adaptif
              </p>
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <Link href="/services">
                  <Button className="bg-blue-400 hover:bg-blue-300">
                    Mulai Membaca <ArrowRight className="ml-2 h-4">
                    </ArrowRight>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="bg-blue-400 hover:bg-blue-300">
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
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Fitur Utama
              </h2>
              <p className="max-w-[700px] text-muted-foreground font-normal text-xl gap-8">
                Teknologi yang membantu penyandang disleksia membaca dengan lebih mudah dan nyaman.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max -w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Eye className="h-6 w-6 text-primary"></Eye>
              </div>
              <h3 className="text-xl font-bold">
                Eye-Tracking
              </h3>
              <p className="text-center text-muted-foreground">
                Teknologi yang melacak gerakan mata untuk menyesuaikan kecepatan membaca.
              </p>
            </div> 
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Headphones className="h-6 w-6"></Headphones>
              </div>
              <h3 className="text-xl font-bold">
                Text-to-Speech
              </h3>
              <p className="text-center text-muted-foreground">
                Mengubah teks menjadi suara dengan kualitas tinggi untuk membantu pemahaman.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary"></BookOpen>
              </div>
              <h3 className="text-xl font-bold">
                Desain Ramah Disleksia
              </h3>
              <p className="text-center text-muted-foreground">Menggunakan font OpenDyslexic dan warna yang ramah untuk penyandang disleksia.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
