import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, dbMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  dbMock: {
    delete: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("@/db", () => ({
  default: dbMock,
}));

const consoleErrorSpy = vi
  .spyOn(console, "error")
  .mockImplementation(() => undefined);

import { createTransaction } from "@/app/dashboard/transactions/new/actions";
import {
  deleteTransaction,
  updateTransaction,
} from "@/app/dashboard/transactions/[transactionId]/actions";

describe("transaction actions", () => {
  beforeEach(() => {
    authMock.mockReset();
    dbMock.insert.mockReset();
    dbMock.update.mockReset();
    dbMock.delete.mockReset();
    consoleErrorSpy.mockImplementation(() => undefined);
    consoleErrorSpy.mockClear();
  });

  it("creates transactions with a date-only string", async () => {
    const returningMock = vi.fn().mockResolvedValue([{ id: 17 }]);
    const valuesMock = vi.fn().mockReturnValue({
      returning: returningMock,
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.insert.mockReturnValue({
      values: valuesMock,
    });

    const result = await createTransaction({
      amount: 55.5,
      categoryId: 2,
      description: "Salary",
      transactionDate: "2026-03-12",
    });

    expect(dbMock.insert).toHaveBeenCalledTimes(1);
    expect(valuesMock).toHaveBeenCalledWith({
      amount: "55.5",
      categoryId: 2,
      description: "Salary",
      transactionDate: "2026-03-12",
      userId: "user_123",
    });
    expect(result).toEqual({
      error: false,
      id: 17,
    });
  });

  it("returns unauthorized when createTransaction has no user", async () => {
    authMock.mockResolvedValue({ userId: null });

    const result = await createTransaction({
      amount: 55.5,
      categoryId: 2,
      description: "Salary",
      transactionDate: "2026-03-12",
    });

    expect(result).toEqual({
      error: true,
      message: "Unauthorized",
    });
    expect(dbMock.insert).not.toHaveBeenCalled();
  });

  it("returns a structured error when createTransaction fails", async () => {
    const valuesMock = vi.fn().mockReturnValue({
      returning: vi.fn().mockRejectedValue(new Error("db down")),
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.insert.mockReturnValue({
      values: valuesMock,
    });

    const result = await createTransaction({
      amount: 55.5,
      categoryId: 2,
      description: "Salary",
      transactionDate: "2026-03-12",
    });

    expect(result).toEqual({
      error: true,
      message: "Failed to create transaction",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("updates transactions and returns a success payload", async () => {
    const returningMock = vi.fn().mockResolvedValue([{ id: 9 }]);
    const whereMock = vi.fn().mockReturnValue({
      returning: returningMock,
    });
    const setMock = vi.fn().mockReturnValue({
      where: whereMock,
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.update.mockReturnValue({
      set: setMock,
    });

    const result = await updateTransaction({
      amount: 12.5,
      categoryId: 4,
      description: "Coffee",
      id: 9,
      transactionDate: "2026-03-15",
    });

    expect(setMock).toHaveBeenCalledWith({
      amount: "12.5",
      categoryId: 4,
      description: "Coffee",
      transactionDate: "2026-03-15",
    });
    expect(result).toEqual({
      error: false,
      id: 9,
    });
  });

  it("returns not found when deleteTransaction does not delete a row", async () => {
    const returningMock = vi.fn().mockResolvedValue([]);
    const whereMock = vi.fn().mockReturnValue({
      returning: returningMock,
    });

    authMock.mockResolvedValue({ userId: "user_123" });
    dbMock.delete.mockReturnValue({
      where: whereMock,
    });

    const result = await deleteTransaction(9);

    expect(result).toEqual({
      error: true,
      message: "Transaction not found",
    });
  });
});
