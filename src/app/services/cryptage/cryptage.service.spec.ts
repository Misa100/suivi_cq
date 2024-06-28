import { TestBed } from '@angular/core/testing';

import { CryptageService } from './cryptage.service';

describe('CryptageService', () => {
  let service: CryptageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
