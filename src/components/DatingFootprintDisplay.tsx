import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Shield,
  MessageCircle,
  Heart,
  Clock,
  Eye
} from 'lucide-react';
import { type DatingFootprint, type FootprintAnalysis } from '@/hooks/useDatingFootprint';

interface DatingFootprintDisplayProps {
  footprint: DatingFootprint;
  analysis: FootprintAnalysis;
  confidenceLevel: { level: string; color: string };
  isPreview?: boolean;
}

export const DatingFootprintDisplay = ({ 
  footprint, 
  analysis, 
  confidenceLevel,
  isPreview = false 
}: DatingFootprintDisplayProps) => {
  const getSentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  if (isPreview) {
    return (
      <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Dating Footprint Available</span>
          <Badge variant="secondary" className="text-xs">
            {footprint.totalMentions} mentions
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          This person has been mentioned in other stories. Click to see behavioral patterns.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-2 border-accent/20 bg-gradient-card backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-accent" />
            Dating Footprint: {footprint.personName}
          </CardTitle>
          <Badge variant="outline" className={confidenceLevel.color}>
            <Shield className="h-3 w-3 mr-1" />
            {confidenceLevel.level}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{footprint.totalMentions} mentions</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>{footprint.verifiedPosts} verified</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Updated {footprint.lastUpdated}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Data Reliability</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(footprint.confidenceScore * 100)}%
            </span>
          </div>
          <Progress value={footprint.confidenceScore * 100} className="h-2" />
        </div>

        <Separator />

        {/* Common Themes */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Common Themes
          </h3>
          <div className="space-y-2">
            {footprint.commonThemes.map((theme, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50"
              >
                <div className="h-2 w-2 bg-accent rounded-full mt-1.5" />
                <span className="text-sm">{theme}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Behavioral Patterns */}
        <div>
          <h3 className="font-semibold mb-3">Behavioral Patterns</h3>
          
          {analysis.positiveTraits.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Positive Traits</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.positiveTraits.map((trait, index) => (
                  <Badge 
                    key={index} 
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis.concerningPatterns.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Concerning Patterns</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.concerningPatterns.map((pattern, index) => (
                  <Badge 
                    key={index} 
                    className="bg-red-50 text-red-800 border-red-200"
                  >
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis.neutralObservations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">General Observations</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.neutralObservations.map((observation, index) => (
                  <Badge 
                    key={index} 
                    className="bg-gray-50 text-gray-800 border-gray-200"
                  >
                    {observation}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Frequency Patterns */}
        <div>
          <h3 className="font-semibold mb-3">Pattern Frequency</h3>
          <div className="space-y-2">
            {footprint.patterns
              .sort((a, b) => b.frequency - a.frequency)
              .slice(0, 5)
              .map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(pattern.sentiment)}
                    <span className="text-sm">{pattern.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          pattern.sentiment === 'positive' ? 'bg-green-500' :
                          pattern.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(pattern.frequency / footprint.totalMentions) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {pattern.frequency}/{footprint.totalMentions}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Anonymous & Aggregated Data</p>
              <p>
                This footprint shows patterns from multiple anonymous posts. Individual stories 
                and poster identities remain completely private and unlinked.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};