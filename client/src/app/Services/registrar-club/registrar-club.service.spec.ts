import { TestBed } from '@angular/core/testing';

import { RegistrarClubService } from './registrar-club.service';

describe('RegistrarClubService', () => {
  let service: RegistrarClubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarClubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
