import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Headphones, BookOpen } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    // hero section
    <div className="flex flex-col py-14">
      <section className="w-full min-h-screen py-12 md:py-24 lg:py-18 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 pl-26">
              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-7xl text-gray-800">
                <AnimatedText className="text-white"></AnimatedText> Easily
              </h1>
              <p className="text-lg font-normal med:text-xl text-gray-800">
                Readibly helps people with dyslexia to have the same and equal chance to gain information by reading using eye-tracking and text-to-speech technology. Try our service for free right now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <Link href="/reader">
                  <Button className="bg-purple-600 text-base font-medium hover:bg-purple-500 px-6 py-4 h-auto">
                    Get Started <ArrowRight className="ml-2 h-5 w-5">
                    </ArrowRight>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="border bg-white text-primary text-base font-medium hover:bg-purple-50 px-6 py-4 h-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[800px] lg:h-[400px] rounded-xl overflow-hidden">
              <Image src="/img/Readibly-Hero.png" alt="hero" layout="fill" objectFit="cover" priority>              
              </Image>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full h-min-screen flex flex-col items-center py-12 md:py-24 bg-purple-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl text-gray-800">
                Main Features
              </h2>
              <p className="max-w-[700px] text-muted-foreground font-normal text-xl gap-8">
                Technology that helps people with dyslexia read more easily and comfortably.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <FeatureCard
              is3D
              icon={<Eye className="h-8 w-8 text-purple-600" />}
              title="Eye-Tracking"
              description={
                <>
                  <span className="text-blue-400">Technology</span>
                  <span> that tracks</span>
                  <span className="text-blue-400"> eye</span>
                  <span> movements to adjust reading speed.</span>
                </>
              }
            />
            <FeatureCard
              is3D
              icon={<Headphones className="h-8 w-8 text-purple-600" />}
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
              is3D
              icon={<BookOpen className="h-8 w-8 text-purple-600" />}
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
    </div>
  );
}
