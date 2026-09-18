import { CardView } from "@/components/CardView";

export const dynamic = "force-dynamic";

export default async function CardPage({ params }: PageProps<"/cards/[id]">) {
  const { id } = await params;
  return <CardView ws="business" id={id} />;
}
