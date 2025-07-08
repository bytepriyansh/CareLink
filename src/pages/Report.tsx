'use client';

import { useState, useRef } from 'react';
import { Download, FileText, Calendar, Heart, Activity, Eye, Volume2, User, Stethoscope, Clipboard, AlertTriangle,  Droplets, Thermometer, Sparkles, History, Minus, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassCard } from '../components/ui/glass-card';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/use-auth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Badge } from '../components/ui/badge';
import { HealthAssistant } from '../lib/gemini';
import { useHealth } from '../context/health-context';
import type { ReportData } from '../types/health';

export function Report() {
  const { user } = useAuth();
  const { healthRecords, getLatestRecord } = useHealth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [assistant] = useState(new HealthAssistant());
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
  };

  const createBaseReport = (): ReportData => {
    const latestRecord = getLatestRecord();
    
    return {
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      symptoms: latestRecord?.notes || "No symptoms reported",
      severity: latestRecord?.assessment?.severity || 'medium',
      vitals: latestRecord?.vitals ? {
        heartRate: `${latestRecord.vitals.heartRate} BPM`,
        bloodPressure: `${latestRecord.vitals.systolic}/${latestRecord.vitals.diastolic} mmHg`,
        oxygenSat: `${latestRecord.vitals.oxygenSat}%`,
        temperature: `${latestRecord.vitals.temperature}°F`,
        respiratoryRate: latestRecord.vitals.respiratoryRate ? `${latestRecord.vitals.respiratoryRate} breaths/min` : undefined
      } : {
        heartRate: '--',
        bloodPressure: '--/--',
        oxygenSat: '--%',
        temperature: '--°F'
      },
      aiRecommendation: latestRecord?.assessment?.response || "No analysis available",
      followUpActions: latestRecord?.assessment?.recommendations || [
        "Schedule a check-up with your healthcare provider"
      ],
      emergencyContact: latestRecord?.assessment?.emergency 
        ? "URGENT: Seek immediate medical attention" 
        : "If symptoms worsen, contact your healthcare provider",
      qrCodeUrl: generateQRCode(`Patient Health Report\nDate: ${new Date().toLocaleDateString()}`)
    };
  };

  const enhanceReportWithAI = async (report: ReportData): Promise<ReportData> => {
    setIsEnhancing(true);
    try {
      const prompt = `Enhance this health report with more detailed analysis and personalized recommendations:
      
      Patient Symptoms: ${report.symptoms}
      Vital Signs: ${JSON.stringify(report.vitals)}
      Current Recommendations: ${report.followUpActions?.join(', ') || 'None'}
      
      Please provide:
      1. A 2-3 sentence executive summary
      2. 3-5 key findings from the data
      3. Enhanced recommendations based on medical best practices
      4. Follow-up questions to help the patient reflect on their condition
      
      Respond in JSON format with these fields:
      {
        "executiveSummary": "",
        "keyFindings": [],
        "enhancedRecommendations": [],
        "followUpQuestions": []
      }`;

      const result = await assistant.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiEnhancements = JSON.parse(jsonString);

      return {
        ...report,
        executiveSummary: aiEnhancements.executiveSummary,
        keyFindings: aiEnhancements.keyFindings,
        followUpActions: aiEnhancements.enhancedRecommendations || report.followUpActions,
        followUpQuestions: aiEnhancements.followUpQuestions
      };
    } catch (error) {
      console.error('AI enhancement failed:', error);
      toast({
        title: "AI Enhancement Error",
        description: "Could not enhance report with AI insights",
        variant: "destructive"
      });
      return report;
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      let report = createBaseReport();

      if (showAdvancedOptions) {
        report = await enhanceReportWithAI(report);
      }

      const assessmentPrompt = `Assess this health report and provide severity rating:
      Symptoms: ${report.symptoms}
      Vitals: ${JSON.stringify(report.vitals)}
      Current severity: ${report.severity}
      
      Respond with JSON containing:
      {
        "severity": "low|medium|high",
        "mood": "descriptive mood",
        "emergency": boolean
      }`;

      const assessmentResult = await assistant.model.generateContent(assessmentPrompt);
      const assessmentResponse = await assessmentResult.response;
      const assessmentText = assessmentResponse.text();
      const assessment = JSON.parse(assessmentText.replace(/```json/g, '').replace(/```/g, '').trim());

      const finalReport = {
        ...report,
        severity: assessment.severity || report.severity,
        mood: assessment.mood || 'Professional',
        emergencyContact: assessment.emergency
          ? "URGENT: Seek immediate medical attention as this may indicate a serious condition"
          : report.emergencyContact
      };

      setReportData(finalReport);
      setReportGenerated(true);

      toast({
        title: "Report Generated",
        description: "Your comprehensive health report is ready",
        action: (
          <Button variant="outline" size="sm" onClick={() => handleVoiceOutput(finalReport)}>
            <Volume2 className="h-4 w-4 mr-1" />
            Hear Summary
          </Button>
        )
      });

      if (assessment.emergency) {
        toast({
          title: "Emergency Alert!",
          description: "This report indicates a potential emergency condition",
          variant: "destructive",
          duration: 10000,
          action: (
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => window.open('tel:911')}>
                Call Emergency
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open('https://maps.google.com?q=nearest+hospital')}>
                Find Hospital
              </Button>
            </div>
          )
        });
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate health report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    toast({
      title: "Creating PDF",
      description: "Preparing your health report for download...",
    });

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = user?.displayName
        ? `Health_Report_${user.displayName.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        : `Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;

      pdf.save(fileName);

      toast({
        title: "Download Complete",
        description: "Your health report has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  const handleVoiceOutput = (report: ReportData) => {
    const fullReport = `Health Report for ${user?.displayName || 'Patient'}. Generated on ${report.date}. 
    Symptoms: ${report.symptoms}. 
    Vital signs: Heart rate ${report.vitals.heartRate}, Blood pressure ${report.vitals.bloodPressure}, 
    Oxygen saturation ${report.vitals.oxygenSat}, Temperature ${report.vitals.temperature}.
    Assessment: ${report.aiRecommendation}`;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullReport);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        toast({
          title: "Playing Report",
          description: "Audio playback started",
        });
      };

      utterance.onend = () => {
        toast({
          title: "Playback Complete",
          description: "Finished reading the report",
        });
      };

      utterance.onerror = (event) => {
        toast({
          title: "Audio Error",
          description: event.error,
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Audio Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The information has been copied",
      });
    });
  };

  const handleRegenerateWithAI = async () => {
    if (!reportData) return;

    try {
      setIsEnhancing(true);
      const enhancedReport = await enhanceReportWithAI(reportData);
      setReportData(enhancedReport);

      toast({
        title: "Report Enhanced",
        description: "AI has improved your health report",
        action: (
          <Button variant="outline" size="sm" onClick={() => handleVoiceOutput(enhancedReport)}>
            <Volume2 className="h-4 w-4 mr-1" />
            Hear Updates
          </Button>
        )
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not improve report with AI",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              AI Health Report Center
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Generate comprehensive, personalized health reports with AI-powered insights
          </p>
        </div>

        {!reportGenerated ? (
          <GlassCard className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <FileText className="h-16 w-16 text-teal-500" />
                <div className="absolute -right-2 -bottom-2 bg-blue-500 rounded-full p-2">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {user?.displayName ? `${user.displayName}'s Health Report` : "Your Health Report"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Create a detailed PDF report including your symptoms, vital signs, AI analysis,
              and personalized recommendations from your medical interactions.
            </p>

            <div className="space-y-4 max-w-md mx-auto">
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative group"
              >
                {isGenerating ? (
                  <>
                    <div className="absolute left-4 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    <span className="group-hover:scale-105 transition-transform">
                      Generate Comprehensive Report
                    </span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full"
              >
                {showAdvancedOptions ? (
                  <>
                    <Minus className="h-4 w-4 mr-2" />
                    Hide Advanced Options
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Show Advanced Options
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-6" ref={reportRef}>
            <GlassCard className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-500/10 p-3 rounded-lg">
                    <FileText className="h-8 w-8 text-teal-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.displayName ? `${user.displayName}'s Health Report` : "Personal Health Report"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {reportData?.date} at {reportData?.time}
                      </div>
                      <Badge variant="outline" className={getSeverityColor(reportData?.severity || 'medium')}>
                        {reportData?.severity} Priority
                      </Badge>
                      {reportData?.severity === 'high' && (
                        <Badge variant="destructive" className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent Attention Recommended
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {reportData?.qrCodeUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={reportData.qrCodeUrl}
                      alt="QR Code"
                      className="h-24 w-24 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Executive Summary (AI-generated) */}
              {reportData?.executiveSummary && (
                <div className="mt-4 p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border-l-4 border-teal-500">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 text-teal-500 mr-2" />
                    AI Executive Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {reportData.executiveSummary}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  onClick={() => reportData && handleVoiceOutput(reportData)}
                  variant="outline"
                  className="border-white/30 dark:border-slate-700/50 hover:bg-white/20"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Audio Summary
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => copyToClipboard(JSON.stringify(reportData, null, 2))}
                  className="text-gray-500 hover:text-teal-500"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy Data
                </Button>
                {showAdvancedOptions && (
                  <Button
                    onClick={handleRegenerateWithAI}
                    disabled={isEnhancing}
                    variant="outline"
                    className="border-purple-500/30 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    {isEnhancing ? (
                      <div className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Enhance with AI
                  </Button>
                )}
              </div>
            </GlassCard>

            {/* Patient Information */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 text-blue-500 mr-2" />
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user?.displayName || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Email</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {user?.email || 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Report ID</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                   CLAI.{Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Generated By</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      CareLink AI 
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {reportData?.keyFindings && reportData.keyFindings.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-teal-500 mr-2" />
                  Key Health Findings
                </h3>
                <ul className="space-y-3">
                  {reportData.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start bg-white/20 dark:bg-slate-800/20 p-3 rounded-lg">
                      <div className="flex-shrink-0 h-5 w-5 text-teal-500 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* Report Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Symptoms & Assessment */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="h-5 w-5 text-purple-500 mr-2" />
                  Symptom Summary & Assessment
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {reportData?.symptoms}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 dark:bg-slate-800/20 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pain Level</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-red-500 h-2.5 rounded-full"
                            style={{ width: '30%' }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">3/10</span>
                      </div>
                    </div>

                    <div className="bg-white/20 dark:bg-slate-800/20 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Symptom Duration</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">~2 hours</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Vitals Summary */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-blue-500 mr-2" />
                  Vital Signs
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Heart Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.vitals.heartRate}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 60-100 BPM</div>
                  </div>

                  <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <span>Blood Pressure</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.vitals.bloodPressure}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 90-140/60-90 mmHg</div>
                  </div>

                  <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                      <Droplets className="h-5 w-5 text-cyan-500" />
                      <span>Oxygen Saturation</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.vitals.oxygenSat}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 95-100%</div>
                  </div>

                  <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span>Temperature</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.vitals.temperature}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 97-99°F</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* AI Recommendation */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 text-teal-500 mr-2" />
                AI Assessment & Recommendations
              </h3>

              <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/10 dark:to-blue-900/10 p-5 rounded-lg border border-teal-100 dark:border-teal-900/30">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {reportData?.aiRecommendation}
                  </p>

                  {reportData?.followUpActions && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommended Follow-up Actions:</h4>
                      <ul className="space-y-2">
                        {reportData.followUpActions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-teal-500 mr-2 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Vitals History */}
            {healthRecords.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <History className="h-5 w-5 text-blue-500 mr-2" />
                  Vital Signs History
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-white/20 dark:bg-slate-800/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Heart Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blood Pressure</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Oxygen</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Temp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/10 dark:bg-slate-800/10 divide-y divide-gray-200 dark:divide-gray-700">
                      {healthRecords.slice(0, 5).map((record) => (
                        <tr key={record.id} className="hover:bg-white/20 dark:hover:bg-slate-800/20">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {record.timestamp.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {record.vitals.heartRate} BPM
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {record.vitals.systolic}/{record.vitals.diastolic} mmHg
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {record.vitals.oxygenSat}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {record.vitals.temperature}°F
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.assessment?.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                              record.assessment?.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                            }`}>
                              {record.assessment?.severity || 'unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Report;