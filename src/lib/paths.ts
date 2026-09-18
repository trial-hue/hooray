import type { Workspace } from "./db";

/** Route prefixes per workspace. */
export function paths(ws: Workspace) {
  const base = ws === "personal" ? "/me" : "";
  return {
    ws,
    home: ws === "personal" ? "/me" : "/digest",
    card: (id: string) => `${base}/cards/${id}`,
    people: ws === "personal" ? "/me/people" : "/people",
    calendar: ws === "personal" ? "/me/calendar" : "/calendar",
    post: ws === "personal" ? "/me/post" : "/print",
    start: ws === "personal" ? "/me/start" : "/onboarding",
    pdf: (id: string) => `/api/cards/${id}/pdf${ws === "personal" ? "?ws=personal" : ""}`,
  };
}
