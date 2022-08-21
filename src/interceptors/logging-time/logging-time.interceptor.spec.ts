import { LoggingTimeInterceptor } from './logging-time.interceptor';

describe('LoggingTimeInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggingTimeInterceptor()).toBeDefined();
  });
});
