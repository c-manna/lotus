import { TestBed } from '@angular/core/testing';

import { APIService } from './api.service';

describe('AjaxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APIService = TestBed.get(APIService);
    expect(service).toBeTruthy();
  });
});
