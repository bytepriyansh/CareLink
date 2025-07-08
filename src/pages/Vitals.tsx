'use client';

import { useState } from 'react';
import { Heart, Thermometer, Activity, Droplets, AlertTriangle, Stethoscope, Clipboard, History, Plus, Minus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GlassCard } from '../components/ui/glass-card';
import { useToast } from '../hooks/use-toast';
import { HealthAssistant } from '../lib/gemini';
import { Progress } from '../components/ui/progress';
import { useHealth } from '../context/health-context';
import type { VitalSigns, HealthRecord } from '../types/health';

export default function Vitals() {
  const [vitals, setVitals] = useState<VitalSigns>({
    heartRate: '',
    systolic: '',
    diastolic: '',
    oxygenSat: '',
    temperature: '',
    respiratoryRate: ''
  });

  const { addHealthRecord, healthRecords } = useHealth();
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [assistant] = useState(new HealthAssistant());
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);
  const [filters, setFilters] = useState({
    severity: '',
    dateRange: 'all',
    emergencyOnly: false
  });

  const vitalFields = [
    {
      key: 'heartRate',
      label: 'Heart Rate',
      placeholder: '60-100',
      unit: 'BPM',
      icon: Heart,
      color: 'text-red-500',
      normalRange: [60, 100]
    },
    {
      key: 'systolic',
      label: 'Systolic BP',
      placeholder: '90-140',
      unit: 'mmHg',
      icon: Activity,
      color: 'text-blue-500',
      normalRange: [90, 140]
    },
    {
      key: 'diastolic',
      label: 'Diastolic BP',
      placeholder: '60-90',
      unit: 'mmHg',
      icon: Activity,
      color: 'text-blue-500',
      normalRange: [60, 90]
    },
    {
      key: 'oxygenSat',
      label: 'Oxygen Saturation',
      placeholder: '95-100',
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-500',
      normalRange: [95, 100]
    },
    {
      key: 'temperature',
      label: 'Body Temperature',
      placeholder: '97-99',
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-500',
      normalRange: [97, 99]
    },
  ];

  const handleInputChange = (field: keyof VitalSigns, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const analyzeVitals = async (vitalsData: VitalSigns) => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze these vital signs:
      - Heart Rate: ${vitalsData.heartRate} BPM
      - Blood Pressure: ${vitalsData.systolic}/${vitalsData.diastolic} mmHg
      - Oxygen Saturation: ${vitalsData.oxygenSat}%
      - Temperature: ${vitalsData.temperature}°F
      - Respiratory Rate: ${vitalsData.respiratoryRate || '--'} breaths/min
      ${notes ? `Additional notes: ${notes}` : ''}`;

      const assessment = await assistant.assessHealthConcern(prompt);
      return assessment;
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze vitals. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vitals.heartRate || !vitals.systolic || !vitals.diastolic) {
      toast({
        title: "Missing Data",
        description: "Please enter at least heart rate and blood pressure",
        variant: "destructive"
      });
      return;
    }

    const newRecord: HealthRecord = {
      vitals: { ...vitals },
      id: Date.now().toString(),
      timestamp: new Date(),
      notes: notes.trim() || undefined
    };

    const analysis = await analyzeVitals(vitals);
    if (analysis) {
      newRecord.assessment = {
        response: analysis.response,
        severity: analysis.severity,
        recommendations: analysis.recommendations,
        emergency: analysis.emergency
      };

      if (analysis.emergency) {
        toast({
          title: "Emergency Alert!",
          description: "Your vitals indicate a potential emergency. Please seek immediate medical attention.",
          variant: "destructive",
          duration: 15000,
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
    }

    addHealthRecord(newRecord);
    setVitals({
      heartRate: '',
      systolic: '',
      diastolic: '',
      oxygenSat: '',
      temperature: '',
      respiratoryRate: ''
    });
    setNotes('');
    setSelectedRecord(newRecord);

    toast({
      title: "Vitals Recorded",
      description: "Your vital signs have been successfully logged and analyzed.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The information has been copied",
      });
    });
  };

  const filteredRecords = healthRecords.filter(record => {
    if (filters.emergencyOnly && !record.assessment?.emergency) return false;
    if (filters.severity && record.assessment?.severity !== filters.severity) return false;

    const now = new Date();
    const recordDate = new Date(record.timestamp);

    if (filters.dateRange === 'today' &&
      !(recordDate.getDate() === now.getDate() &&
        recordDate.getMonth() === now.getMonth() &&
        recordDate.getFullYear() === now.getFullYear())) {
      return false;
    }

    if (filters.dateRange === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (recordDate < oneWeekAgo) return false;
    }

    if (filters.dateRange === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (recordDate < oneMonthAgo) return false;
    }

    return true;
  });

  const getSeverityColor = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateHealthScore = (record: HealthRecord) => {
    let score = 100;
    let factors = 0;

    vitalFields.forEach(field => {
      if (record.vitals[field.key as keyof VitalSigns]) {
        const value = parseFloat(record.vitals[field.key as keyof VitalSigns] || '0');
        if (!isNaN(value)) {
          factors++;
          const [min, max] = field.normalRange;
          if (value < min) score -= (min - value) * 2;
          if (value > max) score -= (value - max) * 2;
        }
      }
    });

    return Math.max(0, Math.min(100, score / factors));
  };

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <Stethoscope className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              HealthVitals Pro
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Advanced vital signs monitoring with AI-powered health insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Record New Vitals
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-gray-500 hover:text-teal-500"
              >
                {showAdvanced ? (
                  <>
                    <Minus className="h-4 w-4 mr-1" />
                    Basic
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Advanced
                  </>
                )}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {vitalFields.slice(0, showAdvanced ? vitalFields.length : 4).map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <field.icon className={`h-4 w-4 ${field.color}`} />
                    <span>{field.label}</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={field.placeholder}
                      value={vitals[field.key as keyof VitalSigns]}
                      onChange={(e) => handleInputChange(field.key as keyof VitalSigns, e.target.value)}
                      className="pr-16 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {field.unit}
                    </span>
                  </div>
                  {vitals[field.key as keyof VitalSigns] && !isNaN(parseFloat(vitals[field.key as keyof VitalSigns] || '')) && (
                    <Progress
                      value={Math.min(100, Math.max(0,
                        ((parseFloat(vitals[field.key as keyof VitalSigns] || '0') - field.normalRange[0]) /
                          (field.normalRange[1] - field.normalRange[0])) * 100))}
                      className={`h-2 ${
                        parseFloat(vitals[field.key as keyof VitalSigns] || '0') < field.normalRange[0] ? 'bg-blue-500' :
                          parseFloat(vitals[field.key as keyof VitalSigns] || '0') > field.normalRange[1] ? 'bg-red-500' :
                            'bg-green-500'
                      }`}
                    />
                  )}
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 rounded-md focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 min-h-[80px]"
                  placeholder="Any symptoms or concerns?"
                />
              </div>

              <Button
                type="submit"
                disabled={isAnalyzing || !vitals.heartRate || !vitals.systolic || !vitals.diastolic}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative group"
              >
                {isAnalyzing ? (
                  <>
                    <div className="absolute left-4 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="group-hover:scale-105 transition-transform">Record & Analyze</span>
                  </>
                )}
              </Button>
            </form>
          </GlassCard>

          <div className="lg:col-span-2 space-y-6">
            {selectedRecord ? (
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Health Analysis
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedRecord.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedRecord.assessment?.response || '')}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <Clipboard className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>

                {selectedRecord.assessment?.emergency && (
                  <div className="flex items-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4 animate-pulse">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">URGENT: Seek immediate medical attention</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Vitals Overview</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {vitalFields.map((field) => (
                        <div key={field.key} className={`bg-white/30 dark:bg-slate-800/30 p-3 rounded-lg border-l-4 ${selectedRecord.vitals[field.key as keyof VitalSigns] ?
                            parseFloat(selectedRecord.vitals[field.key as keyof VitalSigns] || '0') < field.normalRange[0] ? 'border-blue-500' :
                              parseFloat(selectedRecord.vitals[field.key as keyof VitalSigns] || '0') > field.normalRange[1] ? 'border-red-500' :
                                'border-green-500'
                            : 'border-gray-300'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <field.icon className={`h-4 w-4 ${field.color}`} />
                              <span>{field.label}</span>
                            </div>
                            {selectedRecord.vitals[field.key as keyof VitalSigns] && (
                              <span className={`text-xs px-2 py-1 rounded-full ${parseFloat(selectedRecord.vitals[field.key as keyof VitalSigns] || '0') < field.normalRange[0] ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                                  parseFloat(selectedRecord.vitals[field.key as keyof VitalSigns] || '0') > field.normalRange[1] ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                }`}>
                                {parseFloat(selectedRecord.vitals[field.key as keyof VitalSigns] || '0') < field.normalRange[0] ? 'Low' :
                                  parseFloat(selectedRecord.vitals[field.key as keyof VitalSigns] || '0') > field.normalRange[1] ? 'High' : 'Normal'}
                              </span>
                            )}
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {selectedRecord.vitals[field.key as keyof VitalSigns] || '--'} {selectedRecord.vitals[field.key as keyof VitalSigns] && field.unit}
                          </div>
                          {selectedRecord.vitals[field.key as keyof VitalSigns] && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Normal: {field.normalRange[0]}-{field.normalRange[1]}{field.unit}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">Health Status</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedRecord.assessment?.severity)} animate-pulse`}></div>
                        <span className="text-sm capitalize">
                          {selectedRecord.assessment?.severity || 'unknown'} priority
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                      <div className="text-center mb-3">
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                          {Math.round(calculateHealthScore(selectedRecord))}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Health Score</div>
                      </div>
                      <Progress
                        value={calculateHealthScore(selectedRecord)}
                        className={`h-3 ${
                          calculateHealthScore(selectedRecord) > 80 ? 'bg-green-500' :
                            calculateHealthScore(selectedRecord) > 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                        }`}
                      />
                    </div>

                    {selectedRecord.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/20 dark:bg-slate-800/20 p-3 rounded">
                          {selectedRecord.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRecord.assessment && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">AI Assessment</h3>
                        <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg">
                          <p className="text-gray-800 dark:text-gray-200">{selectedRecord.assessment.response}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h3>
                        <ul className="space-y-3">
                          {selectedRecord.assessment.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start space-x-3 bg-white/20 dark:bg-slate-800/20 p-3 rounded-lg">
                              <div className={`w-2 h-2 mt-2 rounded-full ${getSeverityColor(selectedRecord.assessment?.severity)}`}></div>
                              <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                <History className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No Analysis Available
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  Record your vital signs to get an AI-powered health assessment and recommendations.
                </p>
              </GlassCard>
            )}

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Vitals History
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                    className="text-gray-500 hover:text-teal-500"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                    {showHistoryFilters ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {showHistoryFilters && (
                <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Severity
                    </label>
                    <select
                      value={filters.severity}
                      onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">All</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/50 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.emergencyOnly}
                        onChange={(e) => setFilters({ ...filters, emergencyOnly: e.target.checked })}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Emergencies Only</span>
                    </label>
                  </div>
                </div>
              )}

              {filteredRecords.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${selectedRecord?.id === record.id ?
                          'bg-teal-500/10 border border-teal-500/30' :
                          'bg-white/20 dark:bg-slate-800/20 hover:bg-white/30 dark:hover:bg-slate-800/30'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(record.assessment?.severity)}`}></div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {record.vitals.heartRate} BPM • {record.vitals.systolic}/{record.vitals.diastolic} mmHg
                          </span>
                          {record.assessment?.emergency && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 px-2 py-0.5 rounded-full">
                              Emergency
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="w-8 h-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                          <div
                            className="h-1 rounded-full bg-gray-200 dark:bg-gray-700"
                            style={{ width: `${100 - calculateHealthScore(record)}%`, marginLeft: 'auto' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {healthRecords.length === 0 ? (
                    'No records yet. Your vital sign history will appear here.'
                  ) : (
                    'No records match your current filters.'
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}