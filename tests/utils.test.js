const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

describe("Utility Functions Tests", () => {
  describe("ExpressError", () => {
    test("should instantiate an error with status code and message", () => {
      const err = new ExpressError(404, "Page Not Found!");
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(ExpressError);
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe("Page Not Found!");
    });

    test("should support 500 internal server error", () => {
      const err = new ExpressError(500, "Database connection failed");
      expect(err.statusCode).toBe(500);
      expect(err.message).toBe("Database connection failed");
    });
  });

  describe("wrapAsync", () => {
    test("should execute async function and resolve normally", async () => {
      const mockReq = {};
      const mockRes = { json: jest.fn() };
      const mockNext = jest.fn();

      const asyncFn = async (req, res) => {
        res.json({ success: true });
      };

      const wrapped = wrapAsync(asyncFn);
      await wrapped(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("should catch rejected promise and pass error to next()", async () => {
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      const errorToThrow = new Error("Async failure");
      const asyncFn = async () => {
        throw errorToThrow;
      };

      const wrapped = wrapAsync(asyncFn);
      await wrapped(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(errorToThrow);
    });
  });
});
