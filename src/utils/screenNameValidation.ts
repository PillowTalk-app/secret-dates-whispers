// Screen name validation utility
const FORBIDDEN_PATTERNS = [
  // Common first names
  /\b(john|jane|mike|mary|david|sarah|chris|alex|taylor|jordan|sam|jamie|casey|riley|morgan|drew|blake|quinn|avery|sage)\b/i,
  
  // Last initials pattern (letter followed by period or just single letters)
  /\b[a-z]\.$|^\b[a-z]\b$/i,
  
  // Real name patterns (first + last)
  /^[a-z]+\s+[a-z]+$/i,
  
  // Initials (like J.D. or JD)
  /^[a-z]\.?[a-z]\.?$/i,
  
  // Numbers only
  /^\d+$/,
  
  // Too simple patterns
  /^(user|person|human|me|myself)\d*$/i
];

const ENCOURAGED_PATTERNS = [
  /^[a-z]+(moon|star|wave|dream|night|mystic|cosmic|shadow|light|fire|ice|storm|wind|rain|sun)/i,
  /^(midnight|sunset|aurora|cosmic|mystic|shadow|dream|ocean|forest|winter|summer|spring|autumn)[a-z]+/i,
  /^[a-z]+(wanderer|seeker|dreamer|explorer|artist|poet|rebel|sage|phoenix|tiger|wolf|eagle|raven)/i
];

export const validateScreenName = (screenName: string): { isValid: boolean; message: string; suggestions?: string[] } => {
  const trimmed = screenName.trim();
  
  if (trimmed.length < 3) {
    return {
      isValid: false,
      message: "Screen name must be at least 3 characters long"
    };
  }
  
  if (trimmed.length > 20) {
    return {
      isValid: false,
      message: "Screen name must be 20 characters or less"
    };
  }
  
  // Check against forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        message: "Please use a creative screen name. Avoid real names, initials, or common words.",
        suggestions: generateSuggestions()
      };
    }
  }
  
  // Check if it's too generic
  if (/^(user|person|human|test|temp|new|random)\d*$/i.test(trimmed)) {
    return {
      isValid: false,
      message: "Please choose a more creative and unique screen name.",
      suggestions: generateSuggestions()
    };
  }
  
  return {
    isValid: true,
    message: "Great choice! This screen name looks creative and unique."
  };
};

const generateSuggestions = (): string[] => {
  const prefixes = ['Midnight', 'Cosmic', 'Shadow', 'Dream', 'Mystic', 'Ocean', 'Storm', 'Fire', 'Ice', 'Star'];
  const suffixes = ['Walker', 'Seeker', 'Dreamer', 'Wanderer', 'Phoenix', 'Wolf', 'Raven', 'Tiger', 'Sage', 'Moon'];
  
  const suggestions = [];
  for (let i = 0; i < 3; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    suggestions.push(prefix + suffix);
  }
  
  return suggestions;
};

export const getScreenNameHelpText = (): string => {
  return "Choose a creative screen name like 'MidnightWanderer' or 'CosmicDreamer'. Avoid using real names, initials, or common words.";
};