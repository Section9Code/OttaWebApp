import { TestBed, inject } from '@angular/core/testing';

import { TourService } from './tour.service';

describe('TourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TourService ]
    });
  });

  it('should create an instance', inject([TourService], (service: TourService) => {
    expect(service).toBeTruthy();
  }));
});
