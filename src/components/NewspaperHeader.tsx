import Link from 'next/link';

const sections = [
  { name: 'News', slug: 'news' },
  { name: 'Local', slug: 'local' },
  { name: 'Politics', slug: 'politics' },
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
    <header className="bg-white border-b-4 border-black">
      {/* Top Bar */}
      <div className="bg-black text-white text-xs py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>{currentDate}</div>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:underline">Newsletter</Link>
              <span>|</span>
              <Link href="#" className="hover:underline">Subscribe</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b-2 border-black">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <Link href="/" className="block group">
              <h1 className="text-6xl md:text-7xl font-black text-black tracking-tight mb-2 group-hover:opacity-80 transition-opacity" style={{ fontFamily: 'Georgia, serif' }}>
                FROM HELL
              </h1>
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
                America&apos;s Finest News Source
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-400">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-1 md:gap-2 py-2 flex-wrap">
            {sections.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/section/${section.slug}`}
                  className="px-4 py-2 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors uppercase tracking-wider block"
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
