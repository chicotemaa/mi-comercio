import type { ClientFormState, ClientSummary } from "./client-types";

export const INITIAL_CLIENT_FORM: ClientFormState = {
  fullName: "",
  primaryContact: "",
  email: "",
  phone: "",
  instagramHandle: "",
  address: "",
  preferredServices: "",
  notes: "",
  status: "active",
  rating: "5",
  marketingOptIn: false,
};

export function createClientFormState(
  client?: ClientSummary | null,
): ClientFormState {
  if (!client) {
    return INITIAL_CLIENT_FORM;
  }

  return {
    fullName: client.fullName,
    primaryContact: client.primaryContact,
    email: client.email ?? "",
    phone: client.phone ?? "",
    instagramHandle: client.instagramHandle ?? "",
    address: client.address ?? "",
    preferredServices: client.preferredServices.join(", "),
    notes: client.notes ?? "",
    status: client.status,
    rating: String(client.rating ?? 5),
    marketingOptIn: client.marketingOptIn,
  };
}

export function getClientInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
