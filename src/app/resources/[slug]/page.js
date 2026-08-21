import React from 'react';
import Link from 'next/link';

export default function ResourceDetail({ params }) {
  // Format slug to readable title
  const title = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main style={{ padding: '4rem 3rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <Link href="/resources" style={{ color: '#B282F3', textDecoration: 'none', fontWeight: '600', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Resources
      </Link>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '4rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(10px)',
        minHeight: '60vh'
      }}>
        <h1 className="heading-serif" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{title}</h1>
        <div style={{ width: '60px', height: '4px', background: '#B282F3', borderRadius: '2px', marginBottom: '3rem' }}></div>
        
        <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: '1.8' }}>
          This is a placeholder page for the <strong>{title}</strong> resource. You can start filling this with real content, videos, or case studies!
        </p>
      </div>
    </main>
  );
}
