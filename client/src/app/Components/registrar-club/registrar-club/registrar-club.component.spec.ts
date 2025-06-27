import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarClubComponent } from './registrar-club.component';

describe('RegistrarClubComponent', () => {
  let component: RegistrarClubComponent;
  let fixture: ComponentFixture<RegistrarClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarClubComponent]
    });
    fixture = TestBed.createComponent(RegistrarClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
