import { setUser } from "../config";
import { createUser, getUserByName } from "../db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No name was provided");
  }

  let val = await getUserByName(args[0]);
  if (!val) {
    val = await createUser(args[0]);
    setUser(args[0]);
    console.log(`${val.name} is created at: ${val.createdAt}`);
  } else {
    throw new Error("User already exists.");
  }

}
