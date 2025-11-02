import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  private observer!: IntersectionObserver;

  ngOnInit() {
    // Intersection Observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
      console.log('Éléments trouvés:', animatedElements.length);
      animatedElements.forEach(element => {
        this.observer.observe(element);
      });
    }, 100);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
