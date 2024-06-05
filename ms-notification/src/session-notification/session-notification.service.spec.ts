import { Test, TestingModule } from '@nestjs/testing';
import { SessionNotificationService } from './session-notification.service';

describe('SessionNotificationService', () => {
  let service: SessionNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionNotificationService],
    }).compile();

    service = module.get<SessionNotificationService>(SessionNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
