import { TestBed, inject } from '@angular/core/testing';

import { CommentService } from './comment.service';

describe('CommentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ CommentService ]
    });
  });

  it('should create an instance', inject([CommentService], (service: CommentService) => {
    expect(service).toBeTruthy();
  }));
});
