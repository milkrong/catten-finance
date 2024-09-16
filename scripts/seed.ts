import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { categories, accounts, transactions } from "@/db/schema";
import { config } from "dotenv";
import { eachDayOfInterval, format, parse, subDays } from "date-fns";
import { convertAmountToMillion } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

config({ path: "./.env.local" });

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const defaultFrom = new Date();
const defaultTo = subDays(defaultFrom, 100);

const SEED_USER_ID = "user_2l8UoCoEON8U8r0qzNQpayvfcZF";
const SEED_CATEGORIES = [
  { name: "Food", userId: SEED_USER_ID, plaidId: null },
  { name: "Transportation", userId: SEED_USER_ID, plaidId: null },
  { name: "Housing", userId: SEED_USER_ID, plaidId: null },
  { name: "Utilities", userId: SEED_USER_ID, plaidId: null },
  { name: "Entertainment", userId: SEED_USER_ID, plaidId: null },
].map((category) => ({ ...category, id: uuidv4() }));

const SEED_ACCOUNTS = [
  { name: "Checking", userId: SEED_USER_ID, plaidId: null },
  { name: "Savings", userId: SEED_USER_ID, plaidId: null },
].map((account) => ({ ...account, id: uuidv4() }));

const SEED_TRANSACTIONS: (typeof transactions.$inferInsert)[] = [];

const generateAmount = (category: typeof categories.$inferSelect) => {
  switch (category.name) {
    case "Food":
      return Math.floor(Math.random() * 1000000);
    case "Transportation":
      return Math.floor(Math.random() * 1000000);
    case "Housing":
      return Math.floor(Math.random() * 1000000);
    case "Utilities":
      return Math.floor(Math.random() * 1000000);
    case "Entertainment":
      return Math.floor(Math.random() * 1000000);
    default:
      return 0;
  }
};

const generateTransactionForDay = (day: string) => {
  const numberOfTransactions = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numberOfTransactions; i++) {
    const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
    const isExpense = Math.random() > 0.6;

    const amount = generateAmount(category);
    const formattedAmount = convertAmountToMillion(isExpense ? -amount : amount);

    SEED_TRANSACTIONS.push({
      id: uuidv4(),
      accountId: SEED_ACCOUNTS[0].id,
      amount: formattedAmount,
      categoryId: category.id,
      date: parse(day, "yyyy-MM-dd", new Date()),
      payee: "Test Payee",
      notes: "Test Notes",
    });
  }
};

const generateTransaction = () => {
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
  days.forEach((day) => {
    return generateTransactionForDay(format(day, "yyyy-MM-dd"));
  });
};

generateTransaction();

const main = async () => {
  try {
    // reset
    await db.delete(transactions).execute();
    await db.delete(categories).execute();
    await db.delete(accounts).execute();

    // seed
    await db.insert(categories).values(SEED_CATEGORIES).execute();
    await db.insert(accounts).values(SEED_ACCOUNTS).execute();
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
