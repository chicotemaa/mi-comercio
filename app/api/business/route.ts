import { NextResponse } from "next/server";
import { getManagedBusiness } from "@/lib/managed-business";
export async function PATCH(request: Request) {
  const context = await getManagedBusiness();
  if (!context.data)
    return NextResponse.json({ error: context.error }, { status: 503 });
  const raw = await request.json();
  const fields = [
    "name",
    "description",
    "address",
    "phone",
    "email",
    "website",
    "cuit",
  ] as const;
  const data: Record<string, string> = {};
  for (const field of fields) {
    if (
      typeof raw[field] !== "string" ||
      raw[field].length > (field === "description" ? 1000 : 254)
    )
      return NextResponse.json(
        { error: "Revisá los datos del negocio." },
        { status: 400 },
      );
    data[field] = raw[field].trim();
  }
  if (
    data.name.length < 2 ||
    (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
  )
    return NextResponse.json(
      { error: "Revisá el nombre y el email." },
      { status: 400 },
    );
  const { error } = await context.data.backend
    .from("businesses")
    .update(data)
    .eq("id", context.data.business.id);
  return error
    ? NextResponse.json({ error: error.message }, { status: 400 })
    : NextResponse.json({ ok: true });
}
