import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Headphones, BookOpen } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";
import FeatureCard from "@/components/FeatureCard";


export default function Home() {
  return (
    // hero section
    <div className="flex flex-col mb-4">
      <section className="w-full min-h-screen py-4 bg-[#FDFCF4]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 pl-26">
              <h1 className="text-9xl font-semibold sm:text-4xl md:text-5xl lg:text-7xl text-[#1e1e1e]">
                <AnimatedText className="font-bold text-[#2e31ce] inline-block"></AnimatedText> Easily
              </h1>
              <p className="text-lg font-normal med:text-xl text-gray-800">
                Readibly helps people with dyslexia to have the same and equal chance to gain information by reading using eye-tracking and text-to-speech technology. Try Readibly for free right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 py-2">
                <Link href="/reader">
                  <Button className="bg-gradient-to-br from-[#2e31ce] via-[#772abe] to-[#9f53e6] text-base font-medium shadow-[0px_0px_10px_rgba(0,0,0,0.2)] hover:bg-gradient-to-br hover:from-[#373ad3] hover:via-[#9967c7] hover:to-[#a05de2] hover:cursor-pointer px-6 py-4 h-auto">
                    Get Started <ArrowRight className="ml-2 h-5 w-5">
                    </ArrowRight>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="border bg-transparent text-primary text-base font-medium hover:bg-purple-50 px-6 py-4 h-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
              <p className="text-sm font-light text-muted-foreground -mt-2">Try our service with no cost.</p>
            </div>
            <div className="relative w-full h-[700px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image 
                src="/img/Readibly-Hero.png" 
                alt="hero" 
                fill
                className="object-contain"
                priority
              />              
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full h-min-screen flex flex-col items-center py-12 md:py-24 bg-gradient-to-br from-[#2e31ce] via-[#772abe] to-[#a8a9f3]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-medium sm:text-4xl md:text-5xl text-white">
                Main Features
              </h2>
              <p className="max-w-[700px] text-muted-foreground font-light text-xl gap-8 text-white">
                Technology that helps people with dyslexia read more easily and comfortably.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <FeatureCard
              isHover
              icon={<Eye className="h-8 w-8 text-[#2e31ce]" />}
              title="Eye-Tracking"
              description={
                <>
                  <span className="text-blue-400">Technology</span>
                  <span> that tracks</span>
                  <span className="text-blue-400"> eye</span>
                  <span> movements to adjust reading speed and improve reading experience.</span>
                </>
              }
            />
            <FeatureCard
              isHover
              icon={<Headphones className="h-8 w-8 text-[#2e31ce]" />}
              title="Text-to-Speech"
              description={
                <>
                  <span>Convert</span>
                  <span className="text-blue-400"> text</span>
                  <span> into</span>
                  <span className="text-blue-400"> speech</span>
                  <span> with high quality to aid comprehension, helping to understand better.</span>
                </>
              }
            />
            <FeatureCard
              isHover
              icon={<BookOpen className="h-8 w-8 text-[#2e31ce]" />}
              title="Dyslexia Friendly"
              description={
                <>
                  <span>Using</span>
                  <span className="text-blue-400"> OpenDyslexic</span>
                  <span> font and</span>
                  <span className="text-blue-400"> colors</span>
                  <span> that are friendly for people with dyslexia.</span>
                </>
              }
            />
          </div>
        </div>
      </section>
      
      <section className="w-full h-min-screen flex flex-col items-center py-12 md:py-24 bg-[#FDFCF4]">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">

              </div>
            </div>
      </section>
    </div>
  );
}
