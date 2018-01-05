import { TestBed, inject } from '@angular/core/testing';

import { MixpanelServiceService } from './mixpanel-service.service';

describe('MixpanelServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MixpanelServiceService]
    });
  });

  it('should be created', inject([MixpanelServiceService], (service: MixpanelServiceService) => {
    expect(service).toBeTruthy();
  }));
});
