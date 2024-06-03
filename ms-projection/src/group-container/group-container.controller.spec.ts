import { Test, TestingModule } from '@nestjs/testing';
import { GroupContainerController } from './group-container.controller';

describe('GroupContainerController', () => {
  let controller: GroupContainerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupContainerController],
    }).compile();

    controller = module.get<GroupContainerController>(GroupContainerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
