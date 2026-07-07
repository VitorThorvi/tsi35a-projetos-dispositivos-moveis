import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "@rneui/themed";
import { Link } from "expo-router";
import { ZodError } from "zod";

import { AuthInput } from "../../components/ui/AuthInput";
import { authStyles } from "../../constants/styles";
import { colors } from "../../constants/theme";
import { useAuthStore } from "../../stores/useAuthStore";
import { authErrorMessage } from "../../utils/authErrorMessages";

const SIGNUP_HREF = "/(auth)/signup" as never;
const FORGOT_PASSWORD_HREF = "/(auth)/forgot-password" as never;

function firebaseErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const enterGuestMode = useAuthStore((s) => s.enterGuestMode);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [senhaError, setSenhaError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setEmailError(undefined);
    setSenhaError(undefined);
    setFormError(undefined);
    setSubmitting(true);
    try {
      await login(email, senha);
    } catch (err) {
      if (err instanceof ZodError) {
        for (const issue of err.issues) {
          const field = issue.path[0];
          if (field === "email") setEmailError("E-mail inválido.");
          else if (field === "password")
            setSenhaError("A senha deve ter ao menos 6 caracteres.");
        }
      } else {
        const code = firebaseErrorCode(err);
        setFormError(
          code
            ? authErrorMessage(code)
            : "Não foi possível entrar. Tente novamente.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGuest() {
    setFormError(undefined);
    setSubmitting(true);
    try {
      await enterGuestMode();
    } catch {
      setFormError("Não foi possível continuar sem conta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={authStyles.form}>
        <Text style={authStyles.heading}>Bem-vindo</Text>
        <Text style={authStyles.subheading}>
          Entre com sua conta para continuar
        </Text>

        <AuthInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          errorText={emailError}
        />
        <AuthInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          errorText={senhaError}
        />

        {formError ? (
          <Text style={authStyles.formError}>{formError}</Text>
        ) : null}

        <Button
          title="Entrar"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonStyle={authStyles.submitButton}
        />

        <Button
          title="Continuar sem conta"
          type="clear"
          onPress={handleGuest}
          disabled={submitting}
          titleStyle={styles.guestTitle}
        />

        <Link href={FORGOT_PASSWORD_HREF} style={styles.forgotLink}>
          Esqueci minha senha
        </Link>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>Não tem conta? </Text>
          <Link href={SIGNUP_HREF} style={authStyles.footerLink}>
            Cadastre-se
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  guestTitle: { color: colors.textSecondary },
  forgotLink: {
    color: colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
