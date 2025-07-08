export interface VitalSigns {
  heartRate: string;
  systolic: string;
  diastolic: string;
  oxygenSat: string;
  temperature: string;
  respiratoryRate?: string;
}

export interface HealthAssessment {
  response: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  emergency?: boolean;
}

export interface HealthRecord {
  vitals: VitalSigns;
  timestamp: Date;
  id: string;
  notes?: string;
  assessment?: HealthAssessment;
}

export interface ReportData {
  date: string;
  time: string;
  symptoms: string;
  severity: 'low' | 'medium' | 'high';
  vitals: {
    heartRate: string;
    bloodPressure: string;
    oxygenSat: string;
    temperature: string;
    respiratoryRate?: string;
  };
  aiRecommendation: string;
  followUpActions?: string[];
  emergencyContact?: string;
  qrCodeUrl?: string;
  executiveSummary?: string;
  keyFindings?: string[];
  mood?: string;
  followUpQuestions?: string[];
}