
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Heart, 
  FileText, 
  Volume2, 
  Calendar,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassCard } from '../components/ui/glass-card';

const features = [
  {
    icon: MessageSquare,
    title: 'Gemini AI Chat',
    description: 'Intelligent conversation with advanced medical AI'
  },
  {
    icon: Eye,
    title: 'Severity Analyzer',
    description: 'Smart assessment of your health concerns'
  },
  {
    icon: Heart,
    title: 'Vitals Logger',
    description: 'Track and monitor your vital signs over time'
  },
  {
    icon: FileText,
    title: 'PDF Generator',
    description: 'Generate comprehensive health reports'
  },
  {
    icon: Volume2,
    title: 'Voice Output',
    description: 'Accessibility-first audio feedback'
  },
  {
    icon: Calendar,
    title: 'Smart Health Timeline',
    description: 'Visual timeline of your health journey'
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Your{' '}
                  <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                    Calm Companion
                  </span>
                  <br />
                  in Critical Moments
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  AI-powered healthcare assistance that provides intelligent guidance, 
                  tracks your vitals, and supports you when you need it most.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/assistant">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Emergency Assistant
                  </Button>
                </Link>
                <Link to="/vitals">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Enter Vitals
                  </Button>
                </Link>
                <Link to="/report">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    View Health Report
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <GlassCard className="p-8">
                <div className="relative h-96 bg-gradient-to-br from-teal-100 to-blue-200 dark:from-teal-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-500/20 animate-pulse"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <Heart className="h-24 w-24 text-teal-500 mx-auto animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full w-32 mx-auto animate-pulse"></div>
                      <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full w-24 mx-auto animate-pulse delay-100"></div>
                      <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full w-28 mx-auto animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Healthcare Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for intelligent health monitoring and emergency assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <GlassCard key={feature.title} className="p-6 group hover:scale-105 transition-all duration-300">
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-teal-500" />
              <span className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                CareLink AI
              </span>
            </div>
            <div className="flex space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-teal-500 transition-colors">About</a>
              <a href="#" className="hover:text-teal-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-teal-500 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 dark:border-slate-700/50 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 CareLink AI. Your trusted healthcare companion.
          </div>
        </div>
      </footer>
    </div>
  );
}
