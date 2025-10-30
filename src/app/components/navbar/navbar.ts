import { Component, OnInit, HostListener } from '@angular/core';

interface NavLink {
  type: 'link';
  label: string;
  href: string;
  section: string;
}

interface NavCta {
  type: 'cta';
  label: string;
  href: string;
  section: string;
}

interface NavLangSwitcher {
  type: 'langSwitcher';
}

type NavItem = NavLink | NavCta | NavLangSwitcher;

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

  currentLanguage = 'EN';

  navItems: NavItem[] = [
    { type: 'link', label: 'Home', href: '#accueil', section: 'accueil' },
    { type: 'link', label: 'Games', href: '#services', section: 'services' },
    { type: 'link', label: 'Books', href: '#portfolio', section: 'portfolio' },
    { type: 'link', label: 'Musics', href: '#about', section: 'about' },
    { type: 'langSwitcher' },
    { type: 'cta', label: 'Login', href: '#contact', section: 'contact' },
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

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'EN' ? 'FR' : 'EN';
    // Add your language switching logic here later
    console.log('Language switched to:', this.currentLanguage);
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
