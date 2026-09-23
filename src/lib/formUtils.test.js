import { describe, expect, it } from 'vitest';
import { slugifyFileName } from './formUtils.js';

describe('slugifyFileName', () => {
  it('lowercases and hyphenates a normal name', () => {
    expect(slugifyFileName('Ananya Sharma')).toBe('ananya-sharma');
  });

  it('trims surrounding whitespace', () => {
    expect(slugifyFileName('  Deep Shah  ')).toBe('deep-shah');
  });

  it('collapses punctuation into single hyphens without leading/trailing dashes', () => {
    expect(slugifyFileName("O'Brien-Smith")).toBe('o-brien-smith');
  });

  it('returns an empty string for blank or whitespace-only input', () => {
    expect(slugifyFileName('')).toBe('');
    expect(slugifyFileName('   ')).toBe('');
  });
});
