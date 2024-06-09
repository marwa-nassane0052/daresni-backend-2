import { Test, TestingModule } from '@nestjs/testing';
import { SessionNotificationController } from './session-notification.controller';

describe('SessionNotificationController', () => {
  let controller: SessionNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionNotificationController],
    }).compile();

    controller = module.get<SessionNotificationController>(SessionNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
