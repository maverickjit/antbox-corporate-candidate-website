import React from 'react';
import Link from 'next/link';

export default async function ResourceDetail({ params }) {
  // Await the params object (Next.js 15 breaking change)
  const resolvedParams = await params;
  
  // Format slug to readable title
  const title = resolvedParams.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main style={{ padding: '4rem 3rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <Link href="/resources" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Resources
      </Link>
      
      <div style={{
        padding: '2rem 0',
        minHeight: '60vh'
      }}>
        <h1 className="heading-serif" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{title}</h1>
        <div style={{ width: '60px', height: '4px', background: 'var(--accent-purple)', borderRadius: '2px', marginBottom: '3rem' }}></div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
          This is a placeholder page for the <strong style={{color: 'var(--text-primary)'}}>{title}</strong> resource. You can start filling this with real content, videos, or case studies!
        </p>
      </div>
    </main>
  );
}
