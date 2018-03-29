import { TestBed, inject } from '@angular/core/testing';

import { ContentProjectIntegrationServiceService } from './content-project-integration-service.service';

describe('ContentProjectIntegrationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ContentProjectIntegrationServiceService ]
    });
  });

  it('should create an instance', inject([ContentProjectIntegrationServiceService], (service: ContentProjectIntegrationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
