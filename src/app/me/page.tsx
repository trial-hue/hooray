import { QueueView } from "@/components/QueueView";

export const dynamic = "force-dynamic";

export default function MyWeekPage() {
  return <QueueView ws="personal" />;
}
