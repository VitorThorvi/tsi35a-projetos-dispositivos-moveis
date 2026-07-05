import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { create } from "zustand";

import { auth } from "../firebase/config";
import {
  loginInputSchema,
  resetPasswordSchema,
  signupSchema,
} from "../schemas/authSchema";
import { GUEST_UID, GUEST_USER, type AppUser } from "../types/AppUser";

const GUEST_MODE_KEY = "auth.guestMode";

export type AuthStatus =
  | "initializing"
  | "unauthenticated"
  | "guest"
  | "authenticated";

export type AuthState = {
  status: AuthStatus;
  user: AppUser | null;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
};

function toAppUser(user: FirebaseUser): AppUser {
  return { uid: user.uid, displayName: user.displayName, email: user.email };
}

let authListenerRegistered = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "initializing",
  user: null,

  init: async () => {
    if (authListenerRegistered) return;
    authListenerRegistered = true;
    const guestFlag = await AsyncStorage.getItem(GUEST_MODE_KEY);
    onAuthStateChanged(auth, (firebaseUser) => {
      if (get().status === "initializing") {
        if (firebaseUser) {
          if (guestFlag) void AsyncStorage.removeItem(GUEST_MODE_KEY);
          set({ status: "authenticated", user: toAppUser(firebaseUser) });
        } else if (guestFlag) {
          set({ status: "guest", user: GUEST_USER });
        } else {
          set({ status: "unauthenticated", user: null });
        }
        return;
      }
      if (firebaseUser) {
        set({ status: "authenticated", user: toAppUser(firebaseUser) });
      } else if (get().status !== "guest") {
        set({ status: "unauthenticated", user: null });
      }
    });
  },

  login: async (email, password) => {
    const input = loginInputSchema.parse({ email, password });
    const credential = await signInWithEmailAndPassword(
      auth,
      input.email,
      input.password,
    );
    set({ status: "authenticated", user: toAppUser(credential.user) });
  },

  signup: async (name, email, password, confirmPassword) => {
    const input = signupSchema.parse({ name, email, password, confirmPassword });
    const credential = await createUserWithEmailAndPassword(
      auth,
      input.email,
      input.password,
    );
    await updateProfile(credential.user, { displayName: input.name });
    set({
      status: "authenticated",
      user: { ...toAppUser(credential.user), displayName: input.name },
    });
  },

  resetPassword: async (email) => {
    const input = resetPasswordSchema.parse({ email });
    await sendPasswordResetEmail(auth, input.email);
  },

  logout: async () => {
    if (get().status === "guest") {
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
    } else {
      await signOut(auth);
    }
    set({ status: "unauthenticated", user: null });
  },

  enterGuestMode: async () => {
    if (get().status !== "unauthenticated") return;
    await AsyncStorage.setItem(GUEST_MODE_KEY, "true");
    set({ status: "guest", user: GUEST_USER });
  },
}));

export function selectUid(state: AuthState): string {
  if (state.status === "guest") return GUEST_UID;
  if (state.status === "authenticated" && state.user) return state.user.uid;
  throw new Error("selectUid requires an active session (guest or authenticated)");
}
