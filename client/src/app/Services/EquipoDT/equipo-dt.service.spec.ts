import { TestBed } from '@angular/core/testing';

import { EquipoDTService } from './equipo-dt.service';

describe('EquipoDTService', () => {
  let service: EquipoDTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipoDTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
