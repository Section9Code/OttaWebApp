import { TestBed, inject } from '@angular/core/testing';

import { CreatorService } from './creator.service';

describe('CreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatorService]
    });
  });

  it('should be created', inject([CreatorService], (service: CreatorService) => {
    expect(service).toBeTruthy();
  }));
});
