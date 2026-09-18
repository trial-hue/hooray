// HR and CRM connectors. Today these describe what each sync reads; the live
// OAuth connections are week-two work. The demo can simulate a sync.

export type Connector = {
  id: string;
  name: string;
  kind: "hr" | "crm";
  blurb: string;
  reads: string[];
  method: string;
};

export const CONNECTORS: Connector[] = [
  { id: "bamboohr", name: "BambooHR", kind: "hr", blurb: "Staff roster, start dates, managers, leavers.", reads: ["Employee directory: name, work email, job title, department, location", "Hire date and termination date", "Reports-to (for who signs)", "Date of birth, only for staff who have consented"], method: "OAuth app with read-only employee scope; webhook on new hire and termination" },
  { id: "hibob", name: "HiBob", kind: "hr", blurb: "Roster and lifecycle events, including leavers.", reads: ["People: name, email, title, team, site", "Start date, end date, lifecycle status", "Manager", "Date of birth, consent-gated"], method: "Service user with read-only People scope; lifecycle webhooks" },
  { id: "personio", name: "Personio", kind: "hr", blurb: "Roster with departments and supervisors.", reads: ["Employees: name, email, position, department, office", "Hire date, contract end date", "Supervisor", "Birthday, consent-gated"], method: "API credentials with employees:read; nightly sync" },
  { id: "hubspot", name: "HubSpot", kind: "crm", blurb: "Client contacts and the partner who owns them.", reads: ["Contacts: name, company, role, email", "Contact owner (for who signs)", "Customer since (deal closed-won date)", "Company address for delivery"], method: "OAuth with crm.objects.contacts.read; polled hourly" },
  { id: "salesforce", name: "Salesforce", kind: "crm", blurb: "Accounts, contacts and account owners.", reads: ["Contacts and Accounts", "Account owner", "Customer since (first closed opportunity)", "Billing address"], method: "Connected app, read-only; scheduled sync" },
];

export function connector(id: string): Connector | undefined {
  return CONNECTORS.find((c) => c.id === id);
}
