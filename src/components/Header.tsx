import Link from 'next/link';

const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-3xl mx-auto px-6 py-6">
        <Link href="/" className="block text-center group">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
            From Hell
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
