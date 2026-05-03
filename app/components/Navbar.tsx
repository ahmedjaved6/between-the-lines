'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Talk Now', href: '/', className: 'nav-talk' },
    { name: 'Stories', href: '/stories' },
    { name: 'Circles', href: '/circles' },
    { name: 'Story Studio', href: '/studio' },
    { name: 'Become a Guide', href: '/guide' },
  ];

  return (
    <nav id="navbar" aria-label="Main navigation">
      <Link href="/" className="nav-brand" aria-label="Between the Lines Home">
        <img src="/logo.png" alt="" style={{ height: '36px', width: 'auto' }} />
      </Link>

      <button 
        className="mobile-nav-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        style={{ display: 'none' }} /* Hidden by default, shown via CSS media query */
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <ul className={`nav-links ${isOpen ? 'open' : ''}`} role="list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={() => setIsOpen(false)}>
              <button 
                className={`${pathname === link.href ? 'active' : ''} ${link.className || ''}`}
              >
                {link.name}
              </button>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/profile" onClick={() => setIsOpen(false)}>
            <button className={pathname === '/profile' ? 'active' : ''} aria-label="Profile">
              <i className="fas fa-user"></i>
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
