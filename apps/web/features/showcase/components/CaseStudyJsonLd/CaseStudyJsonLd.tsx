const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'Sawdagar Dokanpat',
  description:
    'A non-commercial, bilingual multi-vendor marketplace demonstration for Bangladesh, built with Next.js, Prisma and Better Auth.',
  codeRepository: 'https://github.com/ibrahimSumon47/sawdagar-dokanpart',
  programmingLanguage: ['TypeScript', 'C++', 'C', 'Python', 'Java'],
  runtimePlatform: 'Node.js 24',
  license: 'https://opensource.org/licenses/MIT',
  author: {
    '@type': 'Person',
    name: 'ibrahimSumon47',
    url: 'https://github.com/ibrahimSumon47',
  },
};

/** SoftwareSourceCode structured data for the case study page. */
export function CaseStudyJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps a stored string from closing the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
    />
  );
}
