"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Trophy, Flame, Zap, Timer, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-violet-500/30">
      <Navbar />

      <main className="pt-32 pb-20 px-4">
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-400 px-4 py-1.5 rounded-full">
              ✨ New puzzle every midnight PST
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
              One Brain Teaser. <br />
              One Shot at Glory.
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Ignite your mind with daily puzzles, riddles, and logic challenges.
              Build your streak, climb the leaderboard, and become the Sharpest Spark.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-lg group">
                <Link href="/challenge/today" className="flex items-center gap-2">
                  Take Today's Challenge <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-neutral-800 hover:bg-neutral-900 text-lg">
                <Link href="/leaderboard">View Rankings</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: <Flame className="w-6 h-6 text-orange-500" />,
              title: "Daily Streaks",
              desc: "Don't break the chain. Solve daily to build your streak and earn exclusive badges."
            },
            {
              icon: <Trophy className="w-6 h-6 text-yellow-500" />,
              title: "Global Ranking",
              desc: "Compete with thinkers worldwide. Rank by accuracy, speed, and consistency."
            },
            {
              icon: <Zap className="w-6 h-6 text-blue-500" />,
              title: "Quick Sprints",
              desc: "Engineered to be solved in under 2 minutes. Perfect for your morning coffee."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm h-full">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Challenge Preview */}
        <section className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-[2.5rem] blur opacity-25" />
            <Card className="relative bg-neutral-900 border-neutral-800 rounded-[2rem] overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Today's Pulse</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-400">
                    <span className="flex items-center gap-1.5"><Timer className="w-4 h-4" /> 90s avg</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-500" /> Hard</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-snug">
                  "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-neutral-800">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-neutral-400" />
                      </div>
                    ))}
                    <div className="h-10 px-4 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-400">
                      +1.4k solved today
                    </div>
                  </div>
                  <Button asChild size="lg" className="w-full md:w-auto rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 px-10">
                    <Link href="/challenge/today">Solve Now</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">Daily Spark</span>
          </div>
          <p className="text-sm text-neutral-500 mb-6">
            © 2026 Daily Spark. Designed for the curious.
          </p>
          <div className="flex justify-center gap-6 text-sm text-neutral-500">
            <Link href="/archive" className="hover:text-neutral-300">Archive</Link>
            <Link href="/privacy" className="hover:text-neutral-300">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
