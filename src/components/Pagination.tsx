import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-2 py-8 border-t-2 border-black mt-8">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white transition-colors uppercase text-sm"
        >
          Previous
        </Link>
      )}
      
      {startPage > 1 && (
        <>
          <Link
            href={basePath}
            className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm transition-colors ${
              1 === currentPage
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-gray-500 font-bold">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <Link
          key={page}
          href={page === 1 ? basePath : `${basePath}?page=${page}`}
          className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm transition-colors ${
            page === currentPage
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {page}
        </Link>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-500 font-bold">...</span>}
          <Link
            href={`${basePath}?page=${totalPages}`}
            className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm transition-colors ${
              totalPages === currentPage
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {totalPages}
          </Link>
        </>
      )}
      
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white transition-colors uppercase text-sm"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
