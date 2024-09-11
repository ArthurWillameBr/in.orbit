import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Learn to cook", desiredWeeklyFrequency: 3 },
      { title: "Go to the gym", desiredWeeklyFrequency: 2 },
      { title: "Read more books", desiredWeeklyFrequency: 4 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
    { goalId: result[2].id, createdAt: new Date() },
  ]);
}
seed().finally(() => {
  client.end();
});
