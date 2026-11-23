import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Book } from '../types';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(book)}
      className="group flex flex-col justify-between cursor-pointer pb-4 border-b border-[#E7E0D3] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div>
        <BookCover
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          coverStyle={book.coverStyle}
        />

        <h3 className="mt-3.5 font-serif-display text-[17px] font-semibold leading-snug text-[#1D1B18] group-hover:text-[#9C6521] transition-colors">
          {book.title}
        </h3>

        <p className="mt-1 text-[13px] leading-[1.45] text-[#5B554B] line-clamp-2 min-h-[38px]">
          {book.subtitle || `By ${book.author}`}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <a
          href={`/books/${book.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(book);
          }}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B87D2F] group-hover:text-[#965F19] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>

        {book.pdfUrl && (
          <span className="text-[11px] font-medium text-[#7D7568] whitespace-nowrap">
            PDF
          </span>
        )}
      </div>
    </article>
  );
};
