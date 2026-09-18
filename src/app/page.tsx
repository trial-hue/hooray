import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  redirect(getDb("personal").company ? "/me" : "/me/start");
}
