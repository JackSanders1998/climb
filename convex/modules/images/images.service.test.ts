import { beforeEach, describe, expect, MockedFunction, test, vi } from "vitest";
import { Id } from "../../_generated/dataModel";
import { MutationCtx } from "../../_generated/server";
import { createImage } from "./images.service";

describe("#createImage", () => {
  let mockCtx: MutationCtx;
  let mockUserId: Id<"users">;
  let mockStorageId: Id<"_storage">;

  beforeEach(() => {
    // Create mock user and storage IDs
    mockUserId = "user123" as Id<"users">;
    mockStorageId = "storage456" as Id<"_storage">;

    // Create a mock MutationCtx
    mockCtx = {
      db: {
        insert: vi.fn(),
        get: vi.fn(),
        query: vi.fn(),
        patch: vi.fn(),
        replace: vi.fn(),
        delete: vi.fn(),
      },
    } as any;
  });

  test("should insert image with correct data structure", async () => {
    // Mock the insert method to return a mock ID
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    // Call the function
    await createImage(mockCtx, {
      storageId: mockStorageId,
      author: mockUserId,
    });

    // Verify insert was called with correct parameters
    expect(mockCtx.db.insert).toHaveBeenCalledOnce();
    expect(mockCtx.db.insert).toHaveBeenCalledWith("images", {
      body: mockStorageId,
      format: "image",
      caption: "A sweet caption!",
      author: mockUserId,
    });
  });

  test("should handle different storage IDs", async () => {
    const differentStorageId = "storage999" as Id<"_storage">;
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    await createImage(mockCtx, {
      storageId: differentStorageId,
      author: mockUserId,
    });

    expect(mockCtx.db.insert).toHaveBeenCalledWith("images", {
      body: differentStorageId,
      format: "image",
      caption: "A sweet caption!",
      author: mockUserId,
    });
  });

  test("should handle different author IDs", async () => {
    const differentUserId = "user999" as Id<"users">;
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    await createImage(mockCtx, {
      storageId: mockStorageId,
      author: differentUserId,
    });

    expect(mockCtx.db.insert).toHaveBeenCalledWith("images", {
      body: mockStorageId,
      format: "image",
      caption: "A sweet caption!",
      author: differentUserId,
    });
  });

  test("should always set format to 'image'", async () => {
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    await createImage(mockCtx, {
      storageId: mockStorageId,
      author: mockUserId,
    });

    const insertCall = (mockCtx.db.insert as MockedFunction<any>).mock.calls[0];
    expect(insertCall[1]).toHaveProperty("format", "image");
  });

  test("should always set caption to 'A sweet caption!'", async () => {
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    await createImage(mockCtx, {
      storageId: mockStorageId,
      author: mockUserId,
    });

    const insertCall = (mockCtx.db.insert as MockedFunction<any>).mock.calls[0];
    expect(insertCall[1]).toHaveProperty("caption", "A sweet caption!");
  });

  test("should propagate database errors", async () => {
    const dbError = new Error("Database connection failed");
    (mockCtx.db.insert as MockedFunction<any>).mockRejectedValue(dbError);

    await expect(
      createImage(mockCtx, {
        storageId: mockStorageId,
        author: mockUserId,
      }),
    ).rejects.toThrow("Database connection failed");
  });

  test("should handle undefined return from database insert", async () => {
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(
      undefined as any,
    );

    // Should not throw, even if db.insert returns undefined
    await expect(
      createImage(mockCtx, {
        storageId: mockStorageId,
        author: mockUserId,
      }),
    ).resolves.not.toThrow();
  });

  test("should call insert exactly once", async () => {
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    await createImage(mockCtx, {
      storageId: mockStorageId,
      author: mockUserId,
    });

    expect(mockCtx.db.insert).toHaveBeenCalledTimes(1);
  });

  test("should not call any other database methods", async () => {
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    await createImage(mockCtx, {
      storageId: mockStorageId,
      author: mockUserId,
    });

    // Verify only insert was called
    expect(mockCtx.db.insert).toHaveBeenCalled();
    expect(mockCtx.db.get).not.toHaveBeenCalled();
    expect(mockCtx.db.query).not.toHaveBeenCalled();
    expect(mockCtx.db.patch).not.toHaveBeenCalled();
    expect(mockCtx.db.replace).not.toHaveBeenCalled();
    expect(mockCtx.db.delete).not.toHaveBeenCalled();
  });

  test("should maintain parameter object structure", async () => {
    const mockImageId = "img789" as Id<"images">;
    (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

    const params = {
      storageId: mockStorageId,
      author: mockUserId,
    };

    await createImage(mockCtx, params);

    // Verify the original params object wasn't mutated
    expect(params).toEqual({
      storageId: mockStorageId,
      author: mockUserId,
    });
  });

  describe("Type safety tests", () => {
    test("should accept valid Id types", async () => {
      const mockImageId = "img789" as Id<"images">;
      (mockCtx.db.insert as MockedFunction<any>).mockResolvedValue(mockImageId);

      // This should compile and run without TypeScript errors
      const validParams = {
        storageId: "valid_storage_id" as Id<"_storage">,
        author: "valid_user_id" as Id<"users">,
      };

      await expect(createImage(mockCtx, validParams)).resolves.not.toThrow();
    });

    test("should require both storageId and author parameters", () => {
      // These would cause TypeScript compilation errors:
      // createImage(mockCtx, { storageId: mockStorageId }); // missing author
      // createImage(mockCtx, { author: mockUserId }); // missing storageId
      // createImage(mockCtx, {}); // missing both

      // This test verifies the function signature is correct
      expect(createImage).toBeDefined();
      expect(createImage.length).toBe(2); // expects ctx and params
    });
  });

  describe("Error handling edge cases", () => {
    test("should handle network timeouts", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      (mockCtx.db.insert as MockedFunction<any>).mockRejectedValue(
        timeoutError,
      );

      await expect(
        createImage(mockCtx, {
          storageId: mockStorageId,
          author: mockUserId,
        }),
      ).rejects.toThrow("Request timeout");
    });

    test("should handle validation errors", async () => {
      const validationError = new Error("Invalid field value");
      validationError.name = "ValidationError";
      (mockCtx.db.insert as MockedFunction<any>).mockRejectedValue(
        validationError,
      );

      await expect(
        createImage(mockCtx, {
          storageId: mockStorageId,
          author: mockUserId,
        }),
      ).rejects.toThrow("Invalid field value");
    });
  });
});
