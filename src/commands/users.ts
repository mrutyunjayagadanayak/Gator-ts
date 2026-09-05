import { readConfig, setUser } from "../config";
import { getUserByName, getUsers } from "../db/queries/users";
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

export async function handleUsers(cmdName: string, ...args: string[]): Promise<void> {
  const users = await getUsers();
  const config = readConfig();
  const currentUser = config.currentUserName;
  if (!users) {
    console.log("No users found");
    return;
  }
  for (let user of users) {
    const isCurrent = user.name === currentUser ? " (current)" : "";
    console.log(`* ${user.name}${isCurrent}`);
  }
}
