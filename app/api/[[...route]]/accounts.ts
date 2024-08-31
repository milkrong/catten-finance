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
  );

export default app;
