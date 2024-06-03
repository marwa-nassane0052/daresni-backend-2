import { Test, TestingModule } from '@nestjs/testing';
import { GroupContainerService } from './group-container.service';

describe('GroupContainerService', () => {
  let service: GroupContainerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupContainerService],
    }).compile();

    service = module.get<GroupContainerService>(GroupContainerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
