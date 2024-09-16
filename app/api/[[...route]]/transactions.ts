import { db } from "@/db/database";
import { Hono } from "hono";
import { accounts, categories, transactions } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, gte, inArray, lte, desc, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { insertTransactionSchema } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { parse, subDays } from "date-fns";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");
      if (!auth?.userId) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 100);
      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
      const data = await db
        .select({
          id: transactions.id,
          categoryId: transactions.categoryId,
          category: categories.name,
          payee: transactions.payee,
          amount: transactions.amount,
          accountId: transactions.accountId,
          account: accounts.name,
          notes: transactions.notes,
          date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({
        data,
      });
    }
  )
  .get("/:id", clerkMiddleware(), zValidator("param", z.object({ id: z.string().optional() })), async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    if (!auth?.userId) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    if (!id) {
      return c.json(
        {
          message: "Account ID is required",
        },
        400
      );
    }
    const account = await db
      .select({
        id: transactions.id,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        date: transactions.date,
        accountId: transactions.accountId,
        notes: transactions.notes,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)));

    if (account.length === 0) {
      return c.json(
        {
          message: "Transaction not found",
        },
        404
      );
    }
    return c.json({
      data: account[0],
    });
  })
  .post("/", clerkMiddleware(), zValidator("json", insertTransactionSchema.omit({ id: true })), async (c) => {
    const auth = getAuth(c);
    const value = c.req.valid("json");
    if (!auth?.userId) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const account = await db
      .insert(transactions)
      .values({
        id: uuidv4(),
        ...value,
      })
      .returning();
    return c.json({
      data: account,
    });
  })
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }
      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: uuidv4(),
            ...value,
          }))
        )
        .returning();
      return c.json({
        data,
      });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }
      const transactionsToDelete = await db.$with("transactions-to-delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, auth.userId), inArray(transactions.id, value.ids)))
      );
      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
        .returning({ id: transactions.id });

      return c.json({
        data,
      });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const value = c.req.valid("json");
      if (!auth?.userId) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }
      if (!id) {
        return c.json(
          {
            message: "Account ID is required",
          },
          400
        );
      }

      const transactionsToUpdate = await db.$with("transactions-to-update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
      );

      const data = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set({
          ...value,
        })
        .where(inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`))
        .returning();
      if (data.length === 0) {
        return c.json(
          {
            message: "Transaction not found",
          },
          404
        );
      }
      return c.json({
        data: data[0],
      });
    }
  )
  .delete("/:id", clerkMiddleware(), zValidator("param", z.object({ id: z.string().optional() })), async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    if (!auth?.userId) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    if (!id) {
      return c.json(
        {
          message: "Account ID is required",
        },
        400
      );
    }
    const transactionsToDelete = await db.$with("transactions-to-delete").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
    );
    const data = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
      .returning({ id: transactions.id });
    if (data.length === 0) {
      return c.json(
        {
          message: "Account not found",
        },
        404
      );
    }
    return c.json({
      data: data[0],
    });
  });

export default app;
