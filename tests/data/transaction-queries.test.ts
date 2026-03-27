import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, dbMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  dbMock: {
    select: vi.fn(),
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("@/db", () => ({
  default: dbMock,
}));

vi.mock("server-only", () => ({}));

vi.mock("drizzle-orm", () => ({
  and: (...conditions: unknown[]) => ({
    conditions,
    kind: "and",
  }),
  asc: (column: unknown) => ({
    column,
    kind: "asc",
  }),
  desc: (column: unknown) => ({
    column,
    kind: "desc",
  }),
  eq: (left: unknown, right: unknown) => ({
    kind: "eq",
    left,
    right,
  }),
  gte: (left: unknown, right: unknown) => ({
    kind: "gte",
    left,
    right,
  }),
  lte: (left: unknown, right: unknown) => ({
    kind: "lte",
    left,
    right,
  }),
}));

const consoleErrorSpy = vi
  .spyOn(console, "error")
  .mockImplementation(() => undefined);

import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import { getTransactionsYearsRange } from "@/data/getTransactionsYearsRange";

describe("transaction queries", () => {
  beforeEach(() => {
    authMock.mockReset();
    dbMock.select.mockReset();
    consoleErrorSpy.mockImplementation(() => undefined);
    consoleErrorSpy.mockClear();
  });

  it("queries a month using date-only boundaries", async () => {
    const transactions = [
      {
        amount: "120.00",
        category: "Salary",
        description: "Payday",
        id: 1,
        transactionDate: "2024-02-10",
        transactionType: "income",
      },
    ];
    const leftJoinMock = vi.fn().mockResolvedValue(transactions);
    const orderByMock = vi.fn().mockReturnValue({
      leftJoin: leftJoinMock,
    });
    const whereMock = vi.fn().mockReturnValue({
      orderBy: orderByMock,
    });
    const fromMock = vi.fn().mockReturnValue({
      where: whereMock,
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.select.mockReturnValue({
      from: fromMock,
    });

    const result = await getTransactionsByMonth({
      month: 2,
      year: 2024,
    });

    const whereArg = whereMock.mock.calls[0][0];

    expect(result).toEqual(transactions);
    expect(whereArg).toMatchObject({
      kind: "and",
    });
    expect(whereArg.conditions[1]).toMatchObject({
      kind: "gte",
      right: "2024-02-01",
    });
    expect(whereArg.conditions[2]).toMatchObject({
      kind: "lte",
      right: "2024-02-29",
    });
  });

  it("builds a descending year range from the earliest transaction", async () => {
    const currentYear = new Date().getFullYear();
    const limitMock = vi
      .fn()
      .mockResolvedValue([{ transactionDate: "2022-03-05" }]);
    const orderByMock = vi.fn().mockReturnValue({
      limit: limitMock,
    });
    const whereMock = vi.fn().mockReturnValue({
      orderBy: orderByMock,
    });
    const fromMock = vi.fn().mockReturnValue({
      where: whereMock,
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.select.mockReturnValue({
      from: fromMock,
    });

    const result = await getTransactionsYearsRange();

    expect(result[0]).toBe(currentYear);
    expect(result[result.length - 1]).toBe(2022);
  });

  it("returns an empty list and logs when the monthly query fails", async () => {
    const fromMock = vi.fn().mockImplementation(() => {
      throw new Error("broken query");
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.select.mockReturnValue({
      from: fromMock,
    });

    const result = await getTransactionsByMonth({
      month: 3,
      year: 2026,
    });

    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
