// Screen name validation utility with first name and uniqueness checks
const FORBIDDEN_FIRST_NAMES = [
  // Common first names
  'john', 'jane', 'mike', 'mary', 'david', 'sarah', 'chris', 'alex', 'taylor', 'jordan', 
  'sam', 'jamie', 'casey', 'riley', 'morgan', 'drew', 'blake', 'quinn', 'avery', 'sage',
  'emma', 'olivia', 'sophia', 'isabella', 'ava', 'mia', 'abigail', 'emily', 'charlotte', 'harper',
  'madison', 'elizabeth', 'sofia', 'avery', 'ella', 'scarlett', 'grace', 'chloe', 'victoria', 'riley',
  'aria', 'lily', 'aubrey', 'zoey', 'penelope', 'lillian', 'addison', 'layla', 'natalie', 'camila',
  'liam', 'noah', 'william', 'james', 'oliver', 'benjamin', 'elijah', 'lucas', 'mason', 'logan',
  'alexander', 'ethan', 'jacob', 'michael', 'daniel', 'henry', 'jackson', 'sebastian', 'aiden', 'matthew',
  'samuel', 'david', 'joseph', 'carter', 'owen', 'wyatt', 'john', 'jack', 'luke', 'jayden'
];

const FORBIDDEN_PATTERNS = [
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

// Mock database of existing usernames for uniqueness check
const EXISTING_USERNAMES = new Set([
  'midnightwanderer', 'cosmicseeker', 'shadowdancer', 'dreamweaver', 'mysticmoon',
  'oceanbreeze', 'stormchaser', 'firefly123', 'icequeen', 'nightowl', 'sunrisewarrior',
  'forestspirit', 'rainbowdreamer', 'thunderbolt', 'stargazer', 'moonbeam', 'wildfire',
  'crystalclear', 'deepthoughts', 'brightstar', 'darkangel', 'goldenheart', 'silvermoon'
]);

const ENCOURAGED_PATTERNS = [
  /^[a-z]+(moon|star|wave|dream|night|mystic|cosmic|shadow|light|fire|ice|storm|wind|rain|sun)/i,
  /^(midnight|sunset|aurora|cosmic|mystic|shadow|dream|ocean|forest|winter|summer|spring|autumn)[a-z]+/i,
  /^[a-z]+(wanderer|seeker|dreamer|explorer|artist|poet|rebel|sage|phoenix|tiger|wolf|eagle|raven)/i
];

export const validateScreenName = (screenName: string, firstName?: string): { isValid: boolean; message: string; suggestions?: string[] } => {
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

  // Check if username is taken
  if (EXISTING_USERNAMES.has(trimmed.toLowerCase())) {
    return {
      isValid: false,
      message: "This username is already taken. Please choose a different one.",
      suggestions: generateSuggestions()
    };
  }

  // Check if it matches the user's first name
  if (firstName && trimmed.toLowerCase() === firstName.toLowerCase()) {
    return {
      isValid: false,
      message: "You cannot use your first name as your username. Choose something more creative!",
      suggestions: generateSuggestions()
    };
  }

  // Check if it contains any forbidden first names
  const lowerScreenName = trimmed.toLowerCase();
  for (const forbiddenName of FORBIDDEN_FIRST_NAMES) {
    if (lowerScreenName === forbiddenName || lowerScreenName.includes(forbiddenName)) {
      return {
        isValid: false,
        message: "Username cannot contain common first names. Be more creative!",
        suggestions: generateSuggestions()
      };
    }
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

export const checkUsernameUniqueness = async (username: string): Promise<boolean> => {
  // Simulate API call to check uniqueness
  return !EXISTING_USERNAMES.has(username.toLowerCase());
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
  return "Choose a creative screen name like 'MidnightWanderer' or 'CosmicDreamer'. Cannot use your first name or common names. All usernames must be unique.";
};