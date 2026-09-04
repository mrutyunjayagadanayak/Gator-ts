import { resetUsers } from "../db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  await resetUsers();
  console.log("User table cleaned");
}
