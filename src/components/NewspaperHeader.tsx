import Link from 'next/link';

const sections = [
  { name: 'News', slug: 'news' },
  { name: 'Local', slug: 'local' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Opinion', slug: 'opinion' },
];

export default function NewspaperHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b-2 border-black bg-white">
      {/* Masthead */}
      <div className="border-b border-gray-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {currentDate}
            </div>
            <div className="text-center">
              <Link href="/" className="block">
                <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                  From Hell
                </h1>
                <p className="text-sm text-gray-600 mt-1">America&apos;s Finest News Source</p>
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              {/* Placeholder for weather or other info */}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-300">
        <div className="container mx-auto px-6">
          <ul className="flex items-center justify-center gap-6 md:gap-8 py-3 flex-wrap">
            {sections.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/section/${section.slug}`}
                  className="text-sm font-medium text-black hover:text-green-600 transition-colors uppercase tracking-wide"
                >
                  {section.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
