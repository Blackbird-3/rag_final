import { Client, Account } from "appwrite";
import conf from "../conf/conf";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(conf.appwriteProjectId); // Replace with your project ID

export const account = new Account(client);
export { ID } from "appwrite";
