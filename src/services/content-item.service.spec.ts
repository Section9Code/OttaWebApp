import { TestBed, inject } from '@angular/core/testing';

import { ContentItemService } from './content-item.service';

describe('ContentItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentItemService]
    });
  });

  it('should be created', inject([ContentItemService], (service: ContentItemService) => {
    expect(service).toBeTruthy();
  }));
});
