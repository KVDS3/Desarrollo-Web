import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../Services/Breadcrumb/breadcrumb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <nav aria-label="breadcrumb" *ngIf="breadcrumbs.length > 0">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" *ngFor="let crumb of breadcrumbs; last as isLast">
          <a *ngIf="!isLast && crumb.url" [routerLink]="crumb.url">{{ crumb.label }}</a>
          <span *ngIf="isLast || !crumb.url" class="active">{{ crumb.label }}</span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      background-color: transparent;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      border-radius: 0.25rem;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .breadcrumb-item + .breadcrumb-item::before {
      content: "›";
      padding: 0 0.5rem;
      color: #6c757d;
    }
    .breadcrumb-item a {
      color: #007bff;
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-item a:hover {
      color: #0056b3;
      text-decoration: underline;
    }
    .breadcrumb-item.active {
      color: #6c757d;
      font-weight: 500;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{label: string, url: string | null}> = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
  }
}