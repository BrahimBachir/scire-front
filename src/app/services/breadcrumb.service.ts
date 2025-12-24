import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

// Define the interface for your breadcrumb item
export interface Breadcrumb {
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs = this.buildBreadcrumbs(root);
        this._breadcrumbs.next(breadcrumbs);
      });
  }

  // Recursive function to extract data from all active routes
  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Collect breadcrumb data from the current route's data property
    if (route.data['urls']) {
      const routeDataUrls: Partial<Breadcrumb>[] = route.data['urls'];

      for (const item of routeDataUrls) {
        // Substitute route parameters (e.g., :courseId) in the URL
        const dynamicUrl = this.replaceRouteParameters(item.url || '', route);
        
        // Add to the breadcrumbs list
        breadcrumbs.push({
          title: item.title || '',
          url: dynamicUrl,
        });
      }
    }

    // Continue for child routes
    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  // Utility to replace parameters in the breadcrumb URL
  private replaceRouteParameters(
    url: string,
    route: ActivatedRouteSnapshot
  ): string {
    let replacedUrl = url;
    
    // Iterate over all params from all parent routes
    let currentRoute: any | null = route;
    while(currentRoute) {
      for (const key of Object.keys(currentRoute.params)) {
        // e.g., 'student/courses/:courseId/details' -> 'student/courses/123/details'
        replacedUrl = replacedUrl.replace(`:${key}`, currentRoute.params[key]);
      }
      currentRoute = currentRoute.parent;
    }
    
    return replacedUrl;
  }
}