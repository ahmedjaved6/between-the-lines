'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Talk Now', href: '/', className: 'nav-talk' },
    { name: 'Stories', href: '/stories' },
    { name: 'Circles', href: '/circles' },
    { name: 'Story Studio', href: '/studio' },
    { name: 'Become a Guide', href: '/guide' },
  ];

  return (
    <nav id="navbar" aria-label="Main navigation">
      <Link href="/about" className="nav-brand">
        Between <em>&nbsp;the Lines</em>
      </Link>
      <ul className="nav-links" role="list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <button 
                className={`${pathname === link.href ? 'active' : ''} ${link.className || ''}`}
              >
                {link.name}
              </button>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/profile">
            <button className={pathname === '/profile' ? 'active' : ''}>
              <i className="fas fa-user"></i>
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
