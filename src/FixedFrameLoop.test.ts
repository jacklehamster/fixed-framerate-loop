import { FixedFrameLoop } from './FixedFrameLoop';

describe('FixedFrameLoop', () => {
  let requestAnimationFrameMock: jest.Mock;
  let cancelAnimationFrameMock: jest.Mock;

  beforeEach(() => {
    // Mock requestAnimationFrame and cancelAnimationFrame
    requestAnimationFrameMock = jest.fn();
    cancelAnimationFrameMock = jest.fn();
  });

  describe('startLoop', () => {
    it('should start and cancel the loop correctly', () => {
      const framePeriod = 100;
      const loopCallbackMock = jest.fn();
      const frameLoop = new FixedFrameLoop(
        {
          requestAnimationFrame: requestAnimationFrameMock,
          cancelAnimationFrame: cancelAnimationFrameMock,
        },
        {
          framePeriod,
        }
      );

      const cancelLoop = frameLoop.startLoop(loopCallbackMock);

      // Verify that requestAnimationFrame was called
      expect(requestAnimationFrameMock).toHaveBeenCalled();

      requestAnimationFrameMock.mock.calls[0][0](1000); // Simulate 1 second

      expect(loopCallbackMock).toHaveBeenCalledTimes(10);
      expect(loopCallbackMock).toHaveBeenCalledWith(framePeriod, false);
      expect(loopCallbackMock).toHaveBeenCalledWith(2 * framePeriod, false);
      expect(loopCallbackMock).toHaveBeenCalledWith(3 * framePeriod, false);
      //  ...
      expect(loopCallbackMock).toHaveBeenCalledWith(10 * framePeriod, true);

      requestAnimationFrameMock.mock.calls[0][0](2000); // Simulate another second
      expect(loopCallbackMock).toHaveBeenCalledWith(11 * framePeriod, false);
      //  ...
      expect(loopCallbackMock).toHaveBeenCalledWith(20 * framePeriod, true);

      // Cancel the loop and verify that cancelAnimationFrame was called
      cancelLoop();
      expect(cancelAnimationFrameMock).toHaveBeenCalled();
    });
  });
});
