import { TestBed, inject } from '@angular/core/testing';

import { ContentItemContentService } from './content-item-content.service';

describe('ContentItemContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ContentItemContentService ]
    });
  });

  it('should create an instance', inject([ContentItemContentService], (service: ContentItemContentService) => {
    expect(service).toBeTruthy();
  }));
});
