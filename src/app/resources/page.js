"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './resources.module.css';

const blogPosts = {
  employer: [
    {
      slug: 'what-hiring-managers-actually-look-for-in-an-entry-level-candidate',
      title: 'What Hiring Managers Actually Look For in an Entry-Level Candidate',
      excerpt: 'Every hiring manager says the same thing after a bad entry-level hire: "The resume looked great." That\'s the problem.',
      category: 'Hiring',
      readTime: '6 min read',
      date: 'Aug 10, 2026',
      image: '/culture-1.png',
    },
    {
      slug: 'how-it-works-the-antbox-engine',
      title: 'How It Works: The AntBox Engine',
      excerpt: 'Most staffing pipelines break down at the same point: the gap between "we need someone good" and "someone good is actually doing the work."',
      category: 'Product',
      readTime: '5 min read',
      date: 'Aug 10, 2026',
      image: '/culture-3.png',
    },
  ],
  candidate: [
    {
      slug: 'how-to-build-a-portfolio-with-zero-work-experience',
      title: 'How to Build a Portfolio With Zero Work Experience',
      excerpt: '"I don\'t have experience" is the sentence that stops more students than any interview question ever will.',
      category: 'Career',
      readTime: '7 min read',
      date: 'Aug 10, 2026',
      image: '/culture-2.png',
    },
    {
      slug: 'a-day-in-the-life-of-an-antbox-cohort',
      title: 'A Day in the Life of an AntBox Cohort',
      excerpt: 'Everyone asks the same question before joining a cohort: "So what does the day actually look like?" Here\'s what a real day inside an AntBox cohort looks like.',
      category: 'Culture',
      readTime: '6 min read',
      date: 'Aug 10, 2026',
      image: '/culture-4.png',
    },
  ],
};

const playbooks = {
  employer: [
    { title: "Hiring playbooks", excerpt: "Step-by-step frameworks for screening and selecting top cohort candidates.", category: "Framework", image: "/culture-1.png", readTime: "5 min read" },
    { title: "Interview templates & scorecards", excerpt: "Ready-to-use evaluation scorecards for domain & soft skill assessments.", category: "Templates", image: "/culture-2.png", readTime: "8 min read" },
    { title: "Offer negotiation guide", excerpt: "How to structure competitive, retention-focused offers for young talent.", category: "Guide", image: "/culture-3.png", readTime: "6 min read" },
    { title: "48-Hour Onboarding checklist", excerpt: "Accelerate time-to-value with a structured 48-hour onboarding workflow.", category: "Checklist", image: "/culture-hero-real.jpg", readTime: "4 min read" },
    { title: "Domain evaluation framework", excerpt: "Assess true candidate signal over resume keywords using domain metrics.", category: "Framework", image: "/culture-1.png", readTime: "7 min read" },
    { title: "Tech stack compatibility matrix", excerpt: "Match domain tooling to your team's existing tech stack seamlessly.", category: "Matrix", image: "/culture-hero-group.jpg", readTime: "5 min read" },
  ],
  candidate: [
    { title: "Zero-experience portfolio build guide", excerpt: "Turn real projects and proof-of-work into a portfolio that commands attention.", category: "Guide", image: "/culture-2.png", readTime: "6 min read" },
    { title: "Cold email & outreach teardowns", excerpt: "Proven email scripts and teardowns that get responses from tech founders.", category: "Outreach", image: "/culture-1.png", readTime: "5 min read" },
    { title: "Live Kitchen prep & simulation kit", excerpt: "Practice scenario simulations to ace live technical and operational assessments.", category: "Prep Kit", image: "/culture-hero-group.jpg", readTime: "10 min read" },
    { title: "Resume vs Proof-of-Work framework", excerpt: "How to showcase actual output over traditional resume bullet points.", category: "Framework", image: "/culture-3.png", readTime: "4 min read" },
    { title: "2026 Tech stack learning roadmap", excerpt: "A focused learning path for high-demand modern tools and frameworks.", category: "Roadmap", image: "/culture-hero-real.jpg", readTime: "8 min read" },
    { title: "Script the Play: Technical writing guide", excerpt: "Document your code and decisions clearly for engineering teams.", category: "Writing", image: "/culture-2.png", readTime: "5 min read" },
  ]
};

const successStories = {
  employer: [
    { title: "Scaling GTM Team from 0 to 10 in 14 Days", category: "Success stories", tag: "SaaSify", metric: "10x Hiring Speed" },
    { title: "How HyperGrowth Reduced Engineering Ramp Time by 75%", category: "Success stories", tag: "HyperGrowth", metric: "-75% Ramp Time" },
    { title: "Building a Full-Stack Outbound Engine with AntBox Cohorts", category: "Success stories", tag: "ScaleUp Labs", metric: "$1.2M Pipeline" },
  ],
  candidate: [
    { title: "From Campus to Deployment: Cohort #4 Case Study", category: "Success stories", tag: "Cohort #4", metric: "98% Retain Rate" },
    { title: "How Alex Shipped 5 Live Production Features in 30 Days", category: "Success stories", tag: "Student Story", metric: "5 Features Live" },
    { title: "Landing a Remote Tech Role with 0 Prior Experience", category: "Success stories", tag: "Student Story", metric: "Hired in 14 Days" },
  ]
};

export default function Resources() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Playbooks');

  const tabs = ['Playbooks', 'Blogs', 'Success stories'];

  const currentPlaybooks = selectedRole ? (playbooks[selectedRole] || []) : [];
  const currentBlogs = selectedRole ? (blogPosts[selectedRole] || []) : [];
  const currentSuccessStories = selectedRole ? (successStories[selectedRole] || []) : [];

  return (
    <main className={styles.main}>
      {/* ── Initial Role Selection Prompt (Shown FIRST before content) ── */}
      {!selectedRole ? (
        <div className={styles.initialPromptContainer}>
          {/* Subtle Dynamic Ambient Background System */}
          <div className={styles.bgGlowOrb1}></div>
          <div className={styles.bgGlowOrb2}></div>
          <div className={styles.bgTechGrid}></div>

          {/* Floating Subtle Resource Tags */}
          <div className={`${styles.floatingTag} ${styles.tag1}`}>⚡ Playbooks</div>
          <div className={`${styles.floatingTag} ${styles.tag2}`}>📊 ROI Case Studies</div>
          <div className={`${styles.floatingTag} ${styles.tag3}`}>🛠️ Proof of Work</div>
          <div className={`${styles.floatingTag} ${styles.tag4}`}>🎯 Teardowns</div>

          <div className={styles.roleSelectionHeader}>
            <span className={styles.roleHeaderBadge}>AntBox Resource Center</span>
            <h1 className={styles.roleTitle}>Are you an employer or a candidate?</h1>

            <div className={styles.roleCardsGrid}>
              {/* Employer Card Option */}
              <button
                type="button"
                className={styles.roleCard}
                onClick={() => setSelectedRole('employer')}
              >
                <div className={styles.roleHeaderRow}>
                  <span className={styles.roleTagBadge}>Employers</span>
                </div>
                <h2 className={styles.roleCardTitle}>Hiring & Team Scaling</h2>
                <p className={styles.roleCardDesc}>
                  Playbooks, evaluation frameworks, and ROI case studies to scale your team with pre-vetted talent.
                </p>
                <div className={styles.roleCardAction}>
                  <span className={styles.selectBtnLabel}>Select Employer View &rarr;</span>
                </div>
              </button>

              {/* Candidate Card Option */}
              <button
                type="button"
                className={styles.roleCard}
                onClick={() => setSelectedRole('candidate')}
              >
                <div className={styles.roleHeaderRow}>
                  <span className={styles.roleTagBadge}>Candidates</span>
                </div>
                <h2 className={styles.roleCardTitle}>Cohort & Career Prep</h2>
                <p className={styles.roleCardDesc}>
                  Portfolio guides, outreach teardowns, and practical frameworks to build proof of work and land your next role.
                </p>
                <div className={styles.roleCardAction}>
                  <span className={styles.selectBtnLabel}>Select Candidate View &rarr;</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Content Box (Revealed AFTER option is chosen) ── */
        <div className={styles.contentBox}>
          {/* Active Header Switcher Bar */}
          <div className={styles.activeHeaderBar}>
            <div className={styles.activeInfo}>
              <span className={styles.activeRoleTag}>
                {selectedRole === 'employer' ? 'Employers & Hiring Managers' : 'Students & Candidates'}
              </span>
              <h2 className={styles.activeTitle}>
                {selectedRole === 'employer' ? 'Hiring & Team Scaling Resources' : 'Cohort & Career Prep Resources'}
              </h2>
            </div>

            <div className={styles.roleSwitchToggle}>
              <button 
                type="button"
                className={`${styles.roleToggleBtn} ${selectedRole === 'employer' ? styles.activeToggle : ''}`}
                onClick={() => setSelectedRole('employer')}
              >
                Employers
              </button>
              <button 
                type="button"
                className={`${styles.roleToggleBtn} ${selectedRole === 'candidate' ? styles.activeToggle : ''}`}
                onClick={() => setSelectedRole('candidate')}
              >
                Candidates
              </button>
              <button 
                type="button" 
                className={styles.changeSelectionBtn}
                onClick={() => setSelectedRole(null)}
              >
                &larr; Reset
              </button>
            </div>
          </div>

          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

        {activeTab === 'Blogs' ? (
          <div className={styles.blogGrid}>
            {currentBlogs.map((post) => (
              <Link key={post.slug} href={`/blogs/${post.slug}`} className={styles.blogCard}>
                <div className={styles.blogCardImage}>
                  <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} />
                  <div className={styles.blogCardOverlay}></div>
                  <span className={styles.blogCardCategory}>{post.category}</span>
                </div>
                <div className={styles.blogCardBody}>
                  <h3 className={styles.blogCardTitle}>{post.title}</h3>
                  <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
                  <div className={styles.blogCardMeta}>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : activeTab === 'Success stories' ? (
          <div className={styles.blogGrid}>
            {currentSuccessStories.map((item, index) => {
              const slug = item.title.toLowerCase().replace(/ /g, '-');
              return (
                <Link key={index} href={`/resources/${slug}`} className={styles.blogCard}>
                  <div className={styles.successCardHeader}>
                    <span className={styles.successTag}>{item.tag}</span>
                    <span className={styles.successMetric}>{item.metric}</span>
                  </div>
                  <div className={styles.blogCardBody} style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                    <h3 className={styles.blogCardTitle} style={{ fontSize: '1.15rem', lineHeight: '1.5' }}>{item.title}</h3>
                    <div className={styles.blogCardMeta} style={{ marginTop: '1rem' }}>
                      <span>Read Case Study →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {currentPlaybooks.length > 0 ? (
              currentPlaybooks.map((item, index) => {
                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return (
                  <Link href={`/resources/${slug}`} key={index} className={styles.blogCard}>
                    <div className={styles.blogCardImage}>
                      <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                      <div className={styles.blogCardOverlay}></div>
                      <span className={styles.blogCardCategory}>{item.category}</span>
                    </div>
                    <div className={styles.blogCardBody}>
                      <h3 className={styles.blogCardTitle}>{item.title}</h3>
                      <p className={styles.blogCardExcerpt}>{item.excerpt}</p>
                      <div className={styles.blogCardMeta}>
                        <span>{item.readTime}</span>
                        <span>·</span>
                        <span>View Playbook →</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>No playbooks found for this category.</div>
            )}
          </div>
        )}
      </div>
    )}
  </main>
);
}
