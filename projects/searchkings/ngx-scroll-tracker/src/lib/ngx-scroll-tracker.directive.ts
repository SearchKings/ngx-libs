import { filter, map, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ScrollTrackerService } from './ngx-scroll-tracker.service';

@Directive({
  selector: '[ngxScrollTracker]'
})
export class ScrollTrackerDirective implements AfterViewInit, OnDestroy {
  private element: HTMLElement;
  private currentUrl: string;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private scrollTrackerService: ScrollTrackerService
  ) {
    /**
     * Listen for when the component's route is exited.
     * Store the destination url in the service for later use.
     */
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        map(prevRouteEvent => {
          return this.scrollTrackerService.getUrlForEvent(prevRouteEvent);
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(url => {
        if (url && this.currentUrl) {
          url = url.split('?')[0];
          this.scrollTrackerService.updateScroll(this.currentUrl, {
            destinationUrl: url
          });
        }
      });
  }

  ngAfterViewInit() {
    this.currentUrl = this.router.url ? this.router.url.split('?')[0] : '';
    this.element = this.elementRef.nativeElement;

    if (this.element && this.currentUrl) {
      const prevPosition = this.scrollTrackerService.getScroll(this.currentUrl);

      if (!prevPosition) {
        this.scrollTrackerService.saveScroll(this.currentUrl, {
          position: this.element.scrollTop
        });
      } else {
        this.scrollTrackerService.updateScroll(this.currentUrl, {
          element: this.element
        });
      }
    }
  }

  updateScrollPosition() {
    if (this.currentUrl) {
      this.scrollTrackerService.updateScroll(this.currentUrl, {
        position: this.element.scrollTop
      });
    }
  }

  ngOnDestroy() {
    this.updateScrollPosition();
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
