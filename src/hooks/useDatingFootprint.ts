import { useState, useEffect } from 'react';

export interface BehaviorPattern {
  keyword: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  frequency: number;
  category: 'communication' | 'reliability' | 'intimacy' | 'personality' | 'dating_behavior';
}

export interface DatingFootprint {
  personName: string;
  totalMentions: number;
  verifiedPosts: number;
  patterns: BehaviorPattern[];
  commonThemes: string[];
  lastUpdated: string;
  confidenceScore: number; // How reliable the data is based on post count and verification
}

export interface FootprintAnalysis {
  positiveTraits: string[];
  concerningPatterns: string[];
  neutralObservations: string[];
}

const BEHAVIOR_KEYWORDS = {
  communication: {
    positive: ['responsive', 'communicative', 'honest', 'open', 'clear', 'expressive'],
    negative: ['ghosting', 'poor communication', 'unresponsive', 'vague', 'mixed signals']
  },
  reliability: {
    positive: ['reliable', 'consistent', 'follows through', 'punctual', 'dependable'],
    negative: ['flaky', 'inconsistent', 'cancelled last minute', 'unreliable', 'hot-cold']
  },
  intimacy: {
    positive: ['respectful boundaries', 'consensual', 'considerate', 'attentive'],
    negative: ['disappeared after intimacy', 'pushy', 'disrespectful', 'used me']
  },
  personality: {
    positive: ['kind', 'funny', 'charming', 'genuine', 'caring', 'fun'],
    negative: ['manipulative', 'selfish', 'arrogant', 'dishonest', 'rude']
  },
  dating_behavior: {
    positive: ['great first date', 'thoughtful planning', 'good listener', 'engaging'],
    negative: ['love bombing', 'breadcrumbing', 'future faking', 'controlling']
  }
};

export const useDatingFootprint = () => {
  const [footprints, setFootprints] = useState<Map<string, DatingFootprint>>(new Map());

  // Mock data for demonstration
  useEffect(() => {
    const mockFootprints = new Map<string, DatingFootprint>();
    
    mockFootprints.set('alex-johnson', {
      personName: 'Alex Johnson',
      totalMentions: 4,
      verifiedPosts: 4,
      patterns: [
        { keyword: 'ghosting', sentiment: 'negative', frequency: 3, category: 'communication' },
        { keyword: 'charming', sentiment: 'positive', frequency: 4, category: 'personality' },
        { keyword: 'good first impression', sentiment: 'positive', frequency: 3, category: 'dating_behavior' },
        { keyword: 'disappeared after intimacy', sentiment: 'negative', frequency: 2, category: 'intimacy' }
      ],
      commonThemes: [
        'Charming and engaging on first dates',
        'Tends to ghost after 2-3 dates',
        'Good initial communication that fades',
        'Pattern of disappearing after physical intimacy'
      ],
      lastUpdated: '2 days ago',
      confidenceScore: 0.85
    });

    mockFootprints.set('sam-wilson', {
      personName: 'Sam Wilson',
      totalMentions: 6,
      verifiedPosts: 5,
      patterns: [
        { keyword: 'reliable', sentiment: 'positive', frequency: 5, category: 'reliability' },
        { keyword: 'honest', sentiment: 'positive', frequency: 4, category: 'communication' },
        { keyword: 'respectful', sentiment: 'positive', frequency: 6, category: 'personality' },
        { keyword: 'long-term focused', sentiment: 'positive', frequency: 3, category: 'dating_behavior' }
      ],
      commonThemes: [
        'Consistently reliable and honest',
        'Excellent communication throughout dating',
        'Respectful of boundaries and consent',
        'Seeks meaningful long-term connections',
        'Follow-through matches promises'
      ],
      lastUpdated: '1 week ago',
      confidenceScore: 0.92
    });

    setFootprints(mockFootprints);
  }, []);

  const getFootprintForPerson = (personName: string): DatingFootprint | null => {
    const key = personName.toLowerCase().replace(/\s+/g, '-');
    return footprints.get(key) || null;
  };

  const analyzeFootprint = (footprint: DatingFootprint): FootprintAnalysis => {
    const positive = footprint.patterns
      .filter(p => p.sentiment === 'positive')
      .map(p => p.keyword);
    
    const negative = footprint.patterns
      .filter(p => p.sentiment === 'negative')
      .map(p => p.keyword);
    
    const neutral = footprint.patterns
      .filter(p => p.sentiment === 'neutral')
      .map(p => p.keyword);

    return {
      positiveTraits: positive,
      concerningPatterns: negative,
      neutralObservations: neutral
    };
  };

  const addBehaviorData = (personName: string, content: string) => {
    // Mock sentiment analysis and keyword extraction
    // In real implementation, this would use NLP to extract patterns
    console.log(`Analyzing behavior patterns for ${personName} from content:`, content);
    
    // This would update the footprint with new behavioral data
    // For now, just simulate the process
  };

  const getConfidenceLevel = (score: number): { level: string; color: string } => {
    if (score >= 0.8) return { level: 'High Confidence', color: 'text-green-600' };
    if (score >= 0.6) return { level: 'Medium Confidence', color: 'text-yellow-600' };
    return { level: 'Low Confidence', color: 'text-red-600' };
  };

  return {
    getFootprintForPerson,
    analyzeFootprint,
    addBehaviorData,
    getConfidenceLevel,
    allFootprints: Array.from(footprints.values())
  };
};