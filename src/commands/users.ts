import { setUser } from "../config";
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("No username provided");
  }
  setUser(args[0]);
  console.log(`User has been set to ${args[0]}`);
}
