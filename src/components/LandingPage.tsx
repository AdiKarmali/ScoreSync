import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Zap, 
  ChevronRight, 
  CheckCircle2,
  MousePointer2
} from 'lucide-react';
import { cn } from '../utils/cn';

interface LandingPageProps {
  onEnter: () => void;
  darkMode: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative group p-8 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 hover:border-indigo-500/50 transition-all duration-500"
  >
    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, darkMode }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden selection:bg-indigo-500/30">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-32"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 border border-indigo-500/20"
          >
            <Zap className="w-4 h-4" />
            <span>Next-Generation Academic Intelligence</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight mb-8"
          >
            Sync Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300">
              Academic Journey.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12"
          >
            Transforming the way students calculate, analyze, and manage academic performance through a smarter, faster, and more connected experience.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0 0 0 0px rgba(79, 70, 229, 0.4)", "0 0 0 20px rgba(79, 70, 229, 0)", "0 0 0 0px rgba(79, 70, 229, 0)"]
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity }
              }}
              onClick={onEnter}
              className="px-10 py-5 rounded-2xl bg-indigo-600/80 dark:bg-indigo-500/80 backdrop-blur-xl text-white font-bold text-lg flex items-center gap-3 shadow-2xl shadow-indigo-500/30 group border border-white/20 transition-all"
            >
              Begin Syncing →
            </motion.button>
            
            <div className="flex items-center gap-8 text-gray-400 dark:text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Academic Standardized
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Data Secure
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Report Exporting
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <FeatureCard 
            icon={Zap}
            title="Smart Academic Accuracy"
            description="Built to deliver precise and reliable calculations with a system designed for modern academic workflows."
            delay={0.1}
          />
          <FeatureCard 
            icon={FileText}
            title="Seamless Report Exports"
            description="Generate clean, well-structured reports instantly with a smooth and effortless experience."
            delay={0.2}
          />
          <FeatureCard 
            icon={Shield}
            title="Built Around Privacy"
            description="Everything stays on your device for a faster, cleaner, and fully transparent experience."
            delay={0.3}
          />
        </div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto mb-32"
        >
          <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-[3rem]" />
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Designed for Focus.</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                  A refined interface crafted for clarity, speed, and distraction-free academic productivity.
                </p>
                <ul className="space-y-4">
                  {[
                    "Clean Interactive Interface",
                    "Adaptive Theme Experience",
                    "Fully Responsive Design",
                    "Fast & Lightweight Performance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative bg-gray-900/5 dark:bg-white/5 p-8 lg:p-12 overflow-hidden flex items-center justify-center">
                {/* Live Preview Card */}
                <div className="w-full max-w-sm transform rotate-3 blur-[2px] opacity-60 pointer-events-none scale-110">
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-2xl border border-white/20">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-8" />
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="h-14 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
                      <div className="h-14 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
                    </div>
                    <div className="h-32 bg-indigo-500/10 rounded-xl mb-4" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  </div>
                </div>
                
                {/* Interaction Hint */}
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    x: [0, 10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-1/4 right-1/4 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-indigo-500/20 flex items-center gap-3"
                >
                  <MousePointer2 className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Live Preview</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ScoreSync</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">
            ScoreSync © 2026 • Built by BITian • Privacy First
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs max-w-md">
            Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
