import { describe, expect, it } from 'vitest';
import { districts, districtsForDivision, divisions, findDivisionForDistrict } from './bangladesh';

describe('Bangladesh address data', () => {
  it('covers the eight divisions and 64 districts without duplicates', () => {
    expect(divisions).toHaveLength(8);
    expect(districts).toHaveLength(64);
    expect(new Set(districts).size).toBe(64);
  });

  it('finds the division for a district and its districts', () => {
    expect(findDivisionForDistrict('Tangail')?.name).toBe('Dhaka');
    expect(findDivisionForDistrict('Rangamati')?.name).toBe('Chattogram');
    expect(findDivisionForDistrict('Nowhere')).toBeUndefined();
    expect(districtsForDivision('Sylhet')).toEqual([
      'Habiganj',
      'Moulvibazar',
      'Sunamganj',
      'Sylhet',
    ]);
    expect(districtsForDivision('Nowhere')).toEqual([]);
  });
});
