import { setUser } from "../config";
import { getUserByName } from "../db/queries/users";
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No username provided");
  }
  let user = await getUserByName(args[0]);
  if (!user) {
    throw new Error("User account does not exist");
  }
  setUser(args[0]);
  console.log(`User has been set to ${args[0]}`);
}
