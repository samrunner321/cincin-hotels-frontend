import React from 'react';
import { render, screen } from '@testing-library/react';
import JournalCard from '../JournalCard';

// Mock the BaseCard component
jest.mock('../BaseCard', () => {
  return {
    __esModule: true,
    default: ({ title, description, link, metadata, badges, tags }: any) => (
      <div data-testid="base-card">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <a href={link}>Link</a>
        <div data-testid="metadata">
          {metadata?.map((item: React.ReactNode, i: number) => (
            <div key={i} data-testid="metadata-item">{item}</div>
          ))}
        </div>
        <div data-testid="badges">
          {badges?.map((badge: React.ReactNode, i: number) => (
            <div key={i} data-testid="badge-item">{badge}</div>
          ))}
        </div>
        <div data-testid="tags">
          {tags?.map((tag: any) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
      </div>
    ),
  };
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaCalendarAlt: () => <span data-testid="calendar-icon">📅</span>,
  FaUser: () => <span data-testid="user-icon">👤</span>,
}));

describe('JournalCard Component', () => {
  const mockArticle = {
    id: '1',
    title: 'Alpine Cuisine: A Culinary Journey',
    slug: 'alpine-cuisine',
    excerpt: 'Discover the unique flavors and traditions of alpine cuisine across the mountain regions of Europe.',
    publishedDate: '2023-06-15T10:30:00Z',
    author: {
      name: 'Marco Rossi',
      avatar: {
        id: 'avatar-1'
      }
    },
    image: {
      id: 'img-1',
      title: 'Alpine Cuisine',
    },
    categories: [
      { id: 'cat1', name: 'Food & Dining' },
      { id: 'cat2', name: 'Travel Tips' },
    ],
    readTime: 8,
    isFeatured: true,
  };

  it('renders journal card with all information', () => {
    render(<JournalCard article={mockArticle} />);

    expect(screen.getByText('Alpine Cuisine: A Culinary Journey')).toBeInTheDocument();
    expect(screen.getByText('Discover the unique flavors and traditions of alpine cuisine across the mountain regions of Europe.')).toBeInTheDocument();
    expect(screen.getByText('Food & Dining')).toBeInTheDocument();
    expect(screen.getByText('Travel Tips')).toBeInTheDocument();
  });

  it('displays date when showDate is true', () => {
    render(<JournalCard article={mockArticle} showDate={true} />);
    
    expect(screen.getByText('June 15, 2023')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('hides date when showDate is false', () => {
    render(<JournalCard article={mockArticle} showDate={false} />);
    
    expect(screen.queryByText('June 15, 2023')).not.toBeInTheDocument();
  });

  it('displays author when showAuthor is true', () => {
    render(<JournalCard article={mockArticle} showAuthor={true} />);
    
    expect(screen.getByText('Marco Rossi')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('hides author when showAuthor is false', () => {
    render(<JournalCard article={mockArticle} showAuthor={false} />);
    
    expect(screen.queryByText('Marco Rossi')).not.toBeInTheDocument();
  });

  it('displays read time when showReadTime is true', () => {
    render(<JournalCard article={mockArticle} showReadTime={true} />);
    
    expect(screen.getByText('8 min read')).toBeInTheDocument();
  });

  it('hides read time when showReadTime is false', () => {
    render(<JournalCard article={mockArticle} showReadTime={false} />);
    
    expect(screen.queryByText('8 min read')).not.toBeInTheDocument();
  });

  it('displays excerpt when showExcerpt is true', () => {
    render(<JournalCard article={mockArticle} showExcerpt={true} />);
    
    expect(screen.getByText('Discover the unique flavors and traditions of alpine cuisine across the mountain regions of Europe.')).toBeInTheDocument();
  });

  it('hides excerpt when showExcerpt is false', () => {
    render(<JournalCard article={mockArticle} showExcerpt={false} />);
    
    expect(screen.queryByText('Discover the unique flavors and traditions of alpine cuisine across the mountain regions of Europe.')).not.toBeInTheDocument();
  });

  it('displays featured badge when article is featured', () => {
    render(<JournalCard article={mockArticle} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('applies correct layout class', () => {
    const { rerender } = render(<JournalCard article={mockArticle} layout="featured" />);
    
    expect(screen.getByTestId('base-card').className).toContain('featuredLayout');
    
    rerender(<JournalCard article={mockArticle} layout="horizontal" />);
    
    expect(screen.getByTestId('base-card').className).toContain('horizontalLayout');
  });

  it('handles missing optional article properties gracefully', () => {
    const minimalArticle = {
      id: '2',
      title: 'Minimal Article',
      slug: 'minimal-article',
    };

    render(<JournalCard article={minimalArticle} />);
    
    expect(screen.getByText('Minimal Article')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('min read')).not.toBeInTheDocument();
  });
});