export type AppUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
};

export const GUEST_UID = "local";

export const GUEST_USER: AppUser = {
  uid: GUEST_UID,
  displayName: "Convidado",
  email: null,
};
