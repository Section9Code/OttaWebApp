import { TestBed, inject } from '@angular/core/testing';

import { RequeueService } from './requeue.service';

describe('RequeueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequeueService]
    });
  });

  it('should be created', inject([RequeueService], (service: RequeueService) => {
    expect(service).toBeTruthy();
  }));
});
