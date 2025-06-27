import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Array<{label: string, url: string}>>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  private updateBreadcrumbs(): void {
    if (this.router.url.startsWith('/dashboard')) {
      const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      this.breadcrumbsSubject.next(this.customizeBreadcrumbs(breadcrumbs));
    } else {
      this.breadcrumbsSubject.next([]);
    }
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{label: string, url: string}> = []): Array<{label: string, url: string}> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const breadcrumbLabel = child.snapshot.data['breadcrumb'];
      if (breadcrumbLabel) {
        breadcrumbs.push({ label: breadcrumbLabel, url: url });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private customizeBreadcrumbs(breadcrumbs: Array<{label: string, url: string}>): Array<{label: string, url: string}> {
    // Si estamos en la ruta de perfil, solo mostramos 'Perfil'
    if (this.router.url === '/dashboard/perfil' || this.router.url === '/dashboard') {
      return [{ label: 'Perfil', url: '/dashboard/perfil' }];
    }

    // Reemplazar 'Dashboard' con 'Perfil' como raíz
    return breadcrumbs.map((crumb, index) => {
      if (index === 0 && crumb.label === 'Dashboard') {
        return { label: 'Perfil', url: '/dashboard/perfil' };
      }
      return crumb;
    });
  }
}