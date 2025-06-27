import { TestBed } from '@angular/core/testing';

import { RecuperaContraService } from './recupera-contra.service';

describe('RecuperaContraService', () => {
  let service: RecuperaContraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecuperaContraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
