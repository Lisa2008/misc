import { TestBed } from '@angular/core/testing';

import { LetterGeneratorService } from './letter-generator.service';

describe('LetterGeneratorService', () => {
  let service: LetterGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetterGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
