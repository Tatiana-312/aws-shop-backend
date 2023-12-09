import { Readable } from "stream";
import { handler } from "../handlers/importFileParser";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn().mockImplementationOnce(() => {
      return {
        send: jest.fn().mockImplementationOnce(() => {
          return {
            Body: createReadStream(resolve("./test/testData/test.csv")),
          };
        }),
      };
    }),
    GetObjectCommand: jest.fn(),
    CopyObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  };
});

describe("S3 Event Lambda Handler", () => {
  it("should process S3 event and move parsed file", async () => {
    // Mock S3Event
    const mockS3Event = {
      Records: [
        {
          s3: {
            object: {
              key: "your-key",
            },
            bucket: {
              name: "your-bucket",
            },
          },
        },
      ],
    };

    // await handler(mockS3Event as any);

    //expect(mockSend).toHaveBeenCalled();
  });
});
