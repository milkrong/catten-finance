import { db } from '@/db/database';
import { Hono } from 'hono';
import { accounts } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { insertAccountSchema } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json(
        {
          message: 'Unauthorized',
        },
        401
      );
    }
    const accountsData = await db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));
    return c.json({
      data: accountsData,
    });
  })
  .get(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      if (!auth?.userId) {
        return c.json(
          {
            message: 'Unauthorized',
          },
          401
        );
      }
      if (!id) {
        return c.json(
          {
            message: 'Account ID is required',
          },
          400
        );
      }
      const account = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

      if (account.length === 0) {
        return c.json(
          {
            message: 'Account not found',
          },
          404
        );
      }
      return c.json({
        data: account[0],
      });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid('json');
      if (!auth?.userId) {
        return c.json(
          {
            message: 'Unauthorized',
          },
          401
        );
      }
      const account = await db
        .insert(accounts)
        .values({
          id: uuidv4(),
          userId: auth.userId,
          ...value,
        })
        .returning();
      return c.json({
        data: account,
      });
    }
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid('json');
      if (!auth?.userId) {
        return c.json(
          {
            message: 'Unauthorized',
          },
          401
        );
      }
      const data = await db
        .delete(accounts)
        .where(
          and(eq(accounts.userId, auth.userId), inArray(accounts.id, value.ids))
        )
        .returning({ id: accounts.id });
      return c.json({
        data,
      });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      const value = c.req.valid('json');
      if (!auth?.userId) {
        return c.json(
          {
            message: 'Unauthorized',
          },
          401
        );
      }
      if (!id) {
        return c.json(
          {
            message: 'Account ID is required',
          },
          400
        );
      }
      const account = await db
        .update(accounts)
        .set({
          ...value,
        })
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({ id: accounts.id, name: accounts.name });
      if (account.length === 0) {
        return c.json(
          {
            message: 'Account not found',
          },
          404
        );
      }
      return c.json({
        data: account[0],
      });
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      if (!auth?.userId) {
        return c.json(
          {
            message: 'Unauthorized',
          },
          401
        );
      }
      if (!id) {
        return c.json(
          {
            message: 'Account ID is required',
          },
          400
        );
      }
      const account = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning({ id: accounts.id });
      if (account.length === 0) {
        return c.json(
          {
            message: 'Account not found',
          },
          404
        );
      }
      return c.json({
        data: account[0],
      });
    }
  );

export default app;
