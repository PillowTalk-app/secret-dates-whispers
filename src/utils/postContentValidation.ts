// Post content validation utility to ensure privacy and safety
const PHONE_PATTERNS = [
  // US phone patterns
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  /\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g,
  /\b\d{10}\b/g,
  // International patterns
  /\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
];

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

const SOCIAL_MEDIA_PATTERNS = [
  /@[A-Za-z0-9._]+/g, // @ handles
  /instagram\.com\/[A-Za-z0-9._]+/gi,
  /twitter\.com\/[A-Za-z0-9._]+/gi,
  /facebook\.com\/[A-Za-z0-9._]+/gi,
  /snapchat\.com\/add\/[A-Za-z0-9._]+/gi,
  /tiktok\.com\/@[A-Za-z0-9._]+/gi
];

const LAST_NAME_PATTERNS = [
  // Common patterns that suggest full names
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, // FirstName LastName
  /\b[A-Z]\.\s*[A-Z][a-z]+\b/g, // J. Smith
  /\b[A-Z][a-z]+\s+[A-Z]\./g, // John S.
];

const ADDRESS_PATTERNS = [
  /\b\d+\s+[A-Za-z\s]+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl)\b/gi,
  /\b\d{5}(-\d{4})?\b/g, // ZIP codes
];

const FORBIDDEN_IDENTIFIERS = [
  'ssn', 'social security', 'driver license', 'license plate', 'credit card',
  'bank account', 'routing number', 'passport', 'id number'
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

export const validatePostContent = (content: string, targetName: string): ValidationResult => {
  const errors: string[] = [];
  const suggestions: string[] = [];

  // Check target name - should only be first name or nickname
  if (targetName) {
    // Check for multiple words (potential full name)
    if (targetName.trim().split(/\s+/).length > 1) {
      errors.push("Please use only a first name or nickname, not a full name");
      suggestions.push("Use just their first name like 'Alex' instead of 'Alex Smith'");
    }

    // Check for initials
    if (/^[A-Z]\.\s*[A-Z]\.?$/i.test(targetName.trim())) {
      errors.push("Please use a first name instead of initials");
      suggestions.push("Use their actual first name instead of initials");
    }

    // Check if it looks like a last name only
    if (/^[A-Z][a-z]+$/.test(targetName) && targetName.length > 8) {
      errors.push("This looks like it might be a last name. Please use only their first name");
    }
  }

  // Check content for phone numbers
  PHONE_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push("Please remove phone numbers from your post");
      suggestions.push("Describe the experience without sharing contact information");
    }
  });

  // Check for email addresses
  if (EMAIL_PATTERN.test(content)) {
    errors.push("Please remove email addresses from your post");
    suggestions.push("Focus on the dating experience rather than contact details");
  }

  // Check for social media handles
  SOCIAL_MEDIA_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push("Please remove social media handles and profiles from your post");
      suggestions.push("Describe the person's behavior without linking to their social accounts");
    }
  });

  // Check for potential full names in content
  LAST_NAME_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push("Please avoid using full names in your post content");
      suggestions.push("Use only first names when referring to people");
    }
  });

  // Check for addresses
  ADDRESS_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push("Please remove specific addresses from your post");
      suggestions.push("Use general locations like 'downtown Brooklyn' instead of specific addresses");
    }
  });

  // Check for other identifying information
  const lowerContent = content.toLowerCase();
  FORBIDDEN_IDENTIFIERS.forEach(identifier => {
    if (lowerContent.includes(identifier)) {
      errors.push("Please remove personal identification information");
      suggestions.push("Focus on behavior and experiences rather than personal details");
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    suggestions
  };
};

export const getContentGuidelines = (): string[] => {
  return [
    "Use only first names or nicknames when referring to people",
    "Don't include phone numbers, email addresses, or social media handles",
    "Avoid sharing specific addresses - use general locations instead",
    "Focus on behaviors and experiences, not identifying information",
    "Help others stay safe while protecting everyone's privacy"
  ];
};