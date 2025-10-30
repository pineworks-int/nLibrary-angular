import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  activeSection = 'accueil';
  transitionsEnabled = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resizeTimer: any;

  navLinks = [
    { label: 'Accueil', href: '#accueil', section: 'accueil' },
    { label: 'Services', href: '#services', section: 'services' },
    { label: 'Portfolio', href: '#portfolio', section: 'portfolio' },
    { label: 'À propos', href: '#about', section: 'about' },
    { label: 'Contact', href: '#contact', section: 'contact', isCta: true },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.transitionsEnabled = true;
    }, 100);

    this.setupIntersectionObserver();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.pageYOffset > 50;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.transitionsEnabled = false;

    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.transitionsEnabled = true;
    }, 250);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const navbar = document.querySelector('.navbar');

    if (this.isMobileMenuOpen && navbar && !navbar.contains(target)) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onNavLinkClick(event: Event, section: string): void {
    event.preventDefault();

    // Fermer le menu mobile
    if (window.innerWidth <= 768) {
      this.isMobileMenuOpen = false;
    }

    // Scroll vers la section
    this.scrollToSection(section);
    this.activeSection = section;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            this.activeSection = sectionId;
          }
        }
      });
    }, options);

    setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));
    }, 100);
  }
}
