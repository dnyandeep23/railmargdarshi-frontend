export type Role = 'station-master' | 'signal-controller' | 'traffic-manager';

export interface Station {
  id: string;
  name: string;
  code: string;
  coordinates: { x: number; y: number };
  platforms: number;
  status: 'operational' | 'maintenance' | 'blocked';
}

export interface Train {
  id: string;
  number: string;
  name: string;
  currentStation: string;
  nextStation: string;
  coordinates: { x: number; y: number };
  status: 'on-time' | 'delayed' | 'early';
  delay: number;
  speed: number;
  direction: 'up' | 'down';
}

export interface Alert {
  id: string;
  type: 'conflict' | 'delay' | 'maintenance' | 'signal-failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  station?: string;
  trainIds: string[];
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  estimatedResolution: Date;
}

export interface TrackSegment {
  id: string;
  name: string;
  from: string;
  to: string;
  status: 'free' | 'occupied' | 'reserved' | 'blocked';
  occupyingTrain?: string;
  predictedClearTime?: Date;
  signalState: 'green' | 'yellow' | 'red';
}

export interface AIRecommendation {
  id: string;
  type: 'delay' | 'reroute' | 'hold' | 'priority';
  title: string;
  description: string;
  affectedTrains: string[];
  estimatedBenefit: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}