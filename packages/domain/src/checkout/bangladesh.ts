/** One administrative division and its districts, used by the address form. */
export interface Division {
  name: string;
  districts: readonly string[];
}

/** The eight divisions and 64 districts used for delivery addresses. */
export const divisions: readonly Division[] = [
  {
    name: 'Barishal',
    districts: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  },
  {
    name: 'Chattogram',
    districts: [
      'Bandarban',
      'Brahmanbaria',
      'Chandpur',
      'Chattogram',
      "Cox's Bazar",
      'Cumilla',
      'Feni',
      'Khagrachhari',
      'Lakshmipur',
      'Noakhali',
      'Rangamati',
    ],
  },
  {
    name: 'Dhaka',
    districts: [
      'Dhaka',
      'Faridpur',
      'Gazipur',
      'Gopalganj',
      'Kishoreganj',
      'Madaripur',
      'Manikganj',
      'Munshiganj',
      'Narayanganj',
      'Narsingdi',
      'Rajbari',
      'Shariatpur',
      'Tangail',
    ],
  },
  {
    name: 'Khulna',
    districts: [
      'Bagerhat',
      'Chuadanga',
      'Jashore',
      'Jhenaidah',
      'Khulna',
      'Kushtia',
      'Magura',
      'Meherpur',
      'Narail',
      'Satkhira',
    ],
  },
  {
    name: 'Mymensingh',
    districts: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
  },
  {
    name: 'Rajshahi',
    districts: [
      'Bogura',
      'Chapainawabganj',
      'Joypurhat',
      'Naogaon',
      'Natore',
      'Pabna',
      'Rajshahi',
      'Sirajganj',
    ],
  },
  {
    name: 'Rangpur',
    districts: [
      'Dinajpur',
      'Gaibandha',
      'Kurigram',
      'Lalmonirhat',
      'Nilphamari',
      'Panchagarh',
      'Rangpur',
      'Thakurgaon',
    ],
  },
  {
    name: 'Sylhet',
    districts: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
  },
];

/** Every district name in the seeded address data, without duplicates. */
export const districts: readonly string[] = divisions.flatMap((division) => division.districts);

/** Returns the division that contains a district, or null for an unknown name. */
export function findDivisionForDistrict(district: string): Division | undefined {
  return divisions.find((division) => division.districts.includes(district));
}

/** Returns the districts of a division, or an empty list for an unknown name. */
export function districtsForDivision(division: string): readonly string[] {
  return divisions.find((entry) => entry.name === division)?.districts ?? [];
}
