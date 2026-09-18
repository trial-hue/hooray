import { CardView } from "@/components/CardView";

export const dynamic = "force-dynamic";

export default async function MyCardPage({ params }: PageProps<"/me/cards/[id]">) {
  const { id } = await params;
  return <CardView ws="personal" id={id} />;
}
