'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Headphones, BookOpen, Sparkles } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import FAQ from "@/components/FAQ";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <AnimatedSection className="w-full min-h-screen bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center min-h-screen">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 px-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Reading Assistant</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <AnimatedText className="bg-clip-text text-[#2e31ce]" />
                <br />
                <span className="text-gray-900">Not Harder</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Transform your reading experience with AI-powered eye-tracking and text-to-speech technology. Designed specifically for people with dyslexia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/tutorial">
                  <Button className="bg-gradient-to-r from-[#2e31ce] to-[#772abe] text-white text-base font-medium px-8 py-6 rounded-lg hover:from-[#373ad3] hover:to-[#9967c7] transition-all duration-300">
                    Let&apos;s Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="border-2 border-gray-200 bg-white text-gray-900 text-base font-medium px-8 py-6 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-[500px] md:h-[600px]"
            >
            <div className="relative bg-transparent overflow-hidden w-full h-full">
                <Image 
                  src="/img/hero.png" 
                  alt="Readibly Demo" 
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cutting Edge
              <span className="text-[#2e31ce]"> Technology</span>
            </h2>
            <p className="text-xl text-gray-600">
              Our AI-powered features work together to create a seamless reading experience
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              isHover
              icon={<Eye className="h-8 w-8 text-[#2e31ce]" />}
              title="Eye-Tracking"
              description={
                <>
                  <span className="text-[#2e31ce]">Smart</span>
                  <span> technology that adapts to your reading pace and style</span>
                </>
              }
            />
            <FeatureCard
              isHover
              icon={<Headphones className="h-8 w-8 text-[#2e31ce]" />}
              title="Text-to-Speech"
              description={
                <>
                  <span>Natural-sounding</span>
                  <span className="text-[#2e31ce]"> voice</span>
                  <span> that reads text aloud with perfect clarity</span>
                </>
              }
            />
            <FeatureCard
              isHover
              icon={<BookOpen className="h-8 w-8 text-[#2e31ce]" />}
              title="Dyslexia Friendly"
              description={
                <>
                  <span>Optimized</span>
                  <span className="text-[#2e31ce]"> design</span>
                  <span> with accessible fonts and colors</span>
                </>
              }
            />
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="w-full py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <FAQ />
        </div>
      </AnimatedSection>
    </div>
  );
}
