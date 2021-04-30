import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

export interface RouteScrollPositions {
  [url: string]: RouteScrollPosition;
}

export interface RouteScrollPosition {
  position?: number;
  element?: HTMLElement;
  destinationUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ScrollTrackerService {
  private intervalDuration: number = 1000;
  private intervalId;
  private maxScrollAttempts: number = 25;
  private curScrollAttempt: number = 0;
  private routeScrollPositions: RouteScrollPositions = {};

  constructor(private router: Router, private zone: NgZone) {
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart || event instanceof NavigationEnd
        ),
        pairwise(),
        filter(([prevRouteEvent, currRouteEvent]) => {
          return (
            prevRouteEvent instanceof NavigationEnd &&
            currRouteEvent instanceof NavigationStart
          );
        })
      )
      .subscribe(([prevEvent, currEvent]: [NavigationEnd, NavigationStart]) => {
        const currUrl = currEvent.url ? currEvent.url.split('?')[0] : '';
        const prevUrl = prevEvent.urlAfterRedirects
          ? prevEvent.urlAfterRedirects.split('?')[0]
          : '';
        const savedPosition = this.getScroll(currUrl);

        if (savedPosition) {
          if (prevUrl === savedPosition.destinationUrl) {
            this.prepareScroll(currUrl);
          }
        }
      });
  }

  saveScroll(url: string, scrollPosition: RouteScrollPosition) {
    this.routeScrollPositions[url] = scrollPosition;
  }

  updateScroll(url: string, scrollPosition: Partial<RouteScrollPosition>) {
    const existing = this.getScroll(url);

    if (existing) {
      this.routeScrollPositions[url] = Object.assign(
        {},
        existing,
        scrollPosition
      );
    } else {
      throw new Error(
        'Trying to update scroll position for URL that hasnt been saved yet'
      );
    }
  }

  getScroll(url: string): RouteScrollPosition {
    return this.routeScrollPositions[url];
  }

  getUrlForEvent(event): string {
    if (event instanceof NavigationStart) {
      return event.url.split(';', 1)[0];
    }

    if (event instanceof NavigationEnd) {
      return (event.urlAfterRedirects || event.url).split(';', 1)[0];
    }
  }

  prepareScroll(url: string) {
    this.zone.runOutsideAngular(() => {
      /**
       * Reset any existing interval before starting.
       */
      this.clearScrollChecker();

      /**
       * Make an eager attempt to scroll immediately.
       */
      const initialScrollResult = this.attemptScroll(url);

      /**
       * Only setup an interval if the initial scroll attempt fails.
       */
      if (!initialScrollResult) {
        this.intervalId = setInterval(() => {
          this.attemptScroll(url);
        }, this.intervalDuration);
      }
    });
  }

  clearScrollChecker() {
    this.curScrollAttempt = 0;

    if (!this.intervalId) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      clearInterval(this.intervalId);
    });
  }

  attemptScroll(url: string): boolean {
    const settings = this.getScroll(url);

    /**
     * If you've tried the maximum number of times, and the element does have
     * a scrollHeight, then at least scroll the element to the bottom.
     */
    if (this.curScrollAttempt === this.maxScrollAttempts) {
      this.clearScrollChecker();

      if (settings.element && settings.element.scrollHeight > 0) {
        settings.element.scrollTop = settings.element.scrollHeight;
        return true;
      } else {
        return false;
      }
    }

    /**
     * If the element is at least as tall as the desired scroll position,
     * scroll to the desired settings.
     */
    if (
      settings.element &&
      settings.element.scrollHeight >= settings.position
    ) {
      settings.element.scrollTop = settings.position;
      this.clearScrollChecker();
      return true;
    }

    this.curScrollAttempt++;
    return false;
  }
}
