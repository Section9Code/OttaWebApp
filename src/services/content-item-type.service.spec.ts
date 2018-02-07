import { TestBed, inject } from '@angular/core/testing';

import { ContentItemTypeService } from './content-item-type.service';

describe('ContentItemTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentItemTypeService]
    });
  });

  it('should be created', inject([ContentItemTypeService], (service: ContentItemTypeService) => {
    expect(service).toBeTruthy();
  }));
});
