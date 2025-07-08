import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Heart, 
  FileText, 
  Volume2, 
  Calendar,
  Eye,
  Activity,
  Shield,
  AlertTriangle,
  Clock,
  BarChart2,
  Smartphone,
  Zap,
  CheckCircle,
  Users,
  Award,
  Database,
  Lock,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  User
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassCard } from '../components/ui/glass-card';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

type FeatureCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ delay: delay * 0.1 }}
    >
      <GlassCard className="p-6 group hover:scale-[1.02] transition-all duration-300 h-full">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl group-hover:rotate-6 transition-transform duration-300">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const features = [
  {
    icon: MessageSquare,
    title: 'Gemini AI Chat',
    description: 'Intelligent conversation with advanced medical AI that understands context and provides accurate responses'
  },
  {
    icon: Eye,
    title: 'Severity Analyzer',
    description: 'Smart assessment of your health concerns with triage-level accuracy'
  },
  {
    icon: Heart,
    title: 'Vitals Logger',
    description: 'Track and monitor your vital signs with predictive analytics'
  },
  {
    icon: FileText,
    title: 'PDF Generator',
    description: 'Generate comprehensive health reports with actionable insights'
  },
  {
    icon: Volume2,
    title: 'Voice Output',
    description: 'Accessibility-first audio feedback with natural speech patterns'
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description: 'Continuous health tracking with anomaly detection alerts'
  },
];


const stats = [
  { value: "98%", label: "Accuracy Rate", icon: CheckCircle },
  { value: "24/7", label: "Availability", icon: Clock },
  { value: "10k+", label: "Lives Impacted", icon: Users },
  { value: "50ms", label: "Response Time", icon: Zap }
];

const securityFeatures = [
  {
    icon: Database,
    title: "End-to-End Encryption",
    description: "All health data encrypted in transit and at rest"
  },
  {
    icon: Lock,
    title: "HIPAA Compliant",
    description: "Strict compliance with healthcare privacy regulations"
  },
  {
    icon: Shield,
    title: "Secure Cloud Storage",
    description: "Military-grade security for your sensitive health data"
  }
];

export default function Index() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-teal-400/10 dark:bg-teal-400/5"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              opacity: 0.1
            }}
            animate={{
              x: [null, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              ref={heroRef}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn} className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium mb-4">
                  <Zap className="h-4 w-4 mr-2" />
                  AI-Powered Healthcare Revolution
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                    Intelligent Care
                  </span>
                  <br />
                  When Every Second Counts
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  CareLink AI combines advanced artificial intelligence with medical expertise to provide real-time health monitoring, emergency guidance, and personalized care recommendations.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link to="/assistant">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Assistant
                  </Button>
                </Link>
                <Link to="/vitals">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu">
                    <Activity className="h-5 w-5 mr-2" />
                    Track Vitals
                  </Button>
                </Link>
              
              </motion.div>

            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <GlassCard className="p-8 backdrop-blur-lg">
                <div className="relative h-[32rem] bg-gradient-to-br from-teal-100 to-blue-200 dark:from-teal-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-blue-500/20 animate-pulse"></div>
                  
                  <div className="relative z-10 w-64 h-[28rem] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 dark:bg-slate-700 flex items-center px-3">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="pt-10 px-4 space-y-4">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity
                        }}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 rounded-lg text-white"
                      >
                        <p className="text-sm">Emergency detected: Elevated heart rate</p>
                        <p className="text-xs mt-1">Would you like assistance?</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg"
                      >
                        <p className="text-sm">Yes, I need help</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 rounded-lg text-white"
                      >
                        <p className="text-sm">Please remain calm. I'm analyzing your vitals...</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 3 }}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 rounded-lg text-white"
                      >
                        <p className="text-sm">Based on your symptoms, I recommend:</p>
                        <ul className="text-xs mt-2 space-y-1">
                          <li className="flex items-start">
                            <CheckCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                            Sit down and take deep breaths
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                            Alert your emergency contact
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                            EMS has been notified (ETA: 7min)
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-14 bg-gray-100 dark:bg-slate-700 flex items-center justify-around">
                      <Heart className="h-5 w-5 text-teal-500" />
                      <Activity className="h-5 w-5 text-gray-400" />
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -left-6 -bottom-6 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-xs font-medium">Heart Rate</p>
                    <p className="text-sm font-bold">112 <span className="text-xs font-normal">bpm</span></p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -right-6 top-16 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-xs font-medium">Blood Pressure</p>
                    <p className="text-sm font-bold">142/88</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeIn} className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full shadow-lg mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium mb-4">
              <Award className="h-4 w-4 mr-2" />
              Award-Winning Technology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Healthcare Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for intelligent health monitoring, emergency assistance, and long-term wellness
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title} 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How CareLink AI Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple steps to empower your health journey
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-teal-500 to-blue-600 -translate-x-1/2"></div>
            
            <div className="space-y-16 lg:space-y-0">
              {[
                {
                  step: "1",
                  title: "Setup Your Profile",
                  description: "Create your secure account and input basic health information",
                  icon: Smartphone
                },
                {
                  step: "2",
                  title: "Connect Your Devices",
                  description: "Sync with wearables or manually enter vital signs",
                  icon: Activity
                },
                {
                  step: "3",
                  title: "Receive AI Insights",
                  description: "Get real-time analysis and personalized recommendations",
                  icon: MessageSquare
                },
                {
                  step: "4",
                  title: "Emergency Prepared",
                  description: "Instant access to critical assistance when needed",
                  icon: AlertTriangle
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative lg:flex ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                >
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'} mb-8 lg:mb-0`}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                  <div className="lg:w-1/2">
                    <GlassCard className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-200 dark:from-teal-900/30 dark:to-blue-900/30 rounded-lg flex items-center justify-center">
                        <item.icon className="h-12 w-12 text-teal-500" />
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Data is Protected
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Enterprise-grade security for your most sensitive health information
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {securityFeatures.map((feature) => (
              <motion.div key={feature.title} variants={fadeIn}>
                <GlassCard className="p-8 h-full">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl mb-6">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 opacity-10 dark:opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <GlassCard className="p-12 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Join thousands of users who trust CareLink AI for their health monitoring needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 transform-gpu">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-6 w-6 text-teal-500" />
                <span className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                  CareLink AI
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Advanced AI healthcare assistance for critical moments and everyday wellness.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">API</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/20 dark:border-slate-700/50 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 CareLink AI. All rights reserved.</p>
            <p className="mt-2">Made with <Heart className="inline h-4 w-4 text-red-500" /> for better healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
}