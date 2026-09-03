import { createUser } from "../db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No name was provided");
  }
  try {
    const val = createUser(args[0]);
  }
}
