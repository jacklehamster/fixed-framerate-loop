import { FixedFramerateLoop } from './FixedFramerateLoop';

describe('FixedFramerateLoop', () => {
  let requestAnimationFrameMock: jest.Mock;
  let cancelAnimationFrameMock: jest.Mock;

  beforeEach(() => {
    // Mock requestAnimationFrame and cancelAnimationFrame
    requestAnimationFrameMock = jest.fn();
    cancelAnimationFrameMock = jest.fn();
  });

  describe('startLoop', () => {
    it('should start and cancel the loop correctly', () => {
      const frameDuration = 100;
      const loopCallbackMock = jest.fn();
      const frameLoop = new FixedFramerateLoop(
        {
          requestAnimationFrame: requestAnimationFrameMock,
          cancelAnimationFrame: cancelAnimationFrameMock,
        },
      );

      const cancelLoop = frameLoop.startLoop(loopCallbackMock, {
        frameDuration,
      });

      // Verify that requestAnimationFrame was called
      expect(requestAnimationFrameMock).toHaveBeenCalled();

      requestAnimationFrameMock.mock.calls[0][0](1000); // Simulate 1 second

      expect(loopCallbackMock).toHaveBeenCalledTimes(10);
      expect(loopCallbackMock).toHaveBeenCalledWith(frameDuration, false);
      expect(loopCallbackMock).toHaveBeenCalledWith(2 * frameDuration, false);
      expect(loopCallbackMock).toHaveBeenCalledWith(3 * frameDuration, false);
      //  ...
      expect(loopCallbackMock).toHaveBeenCalledWith(10 * frameDuration, true);

      requestAnimationFrameMock.mock.calls[0][0](2000); // Simulate another second
      expect(loopCallbackMock).toHaveBeenCalledWith(11 * frameDuration, false);
      //  ...
      expect(loopCallbackMock).toHaveBeenCalledWith(20 * frameDuration, true);

      // Cancel the loop and verify that cancelAnimationFrame was called
      cancelLoop();
      expect(cancelAnimationFrameMock).toHaveBeenCalled();
    });
  });
});
