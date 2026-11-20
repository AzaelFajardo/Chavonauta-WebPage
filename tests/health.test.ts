import { describe, it, expect } from "vitest";
import { GET as healthCheck } from "@/app/api/health/route";

describe("Healthcheck endpoint", () => {
  it("reports a healthy status when the database and uploads are available", async () => {
    const response = await healthCheck();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.checks.database).toBe("ok");
    expect(data.checks.uploads).toBe("ok");
  });
});
