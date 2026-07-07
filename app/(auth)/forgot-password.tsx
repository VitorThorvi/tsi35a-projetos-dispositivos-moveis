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

function firebaseErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

export default function ForgotPasswordScreen() {
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setEmailError(undefined);
    setFormError(undefined);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      if (err instanceof ZodError) {
        for (const issue of err.issues) {
          const field = issue.path[0];
          if (field === "email") setEmailError("E-mail inválido.");
        }
      } else {
        const code = firebaseErrorCode(err);
        setFormError(
          code
            ? authErrorMessage(code)
            : "Não foi possível enviar o e-mail de recuperação. Tente novamente.",
        );
      }
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
        <Text style={authStyles.heading}>Recuperar senha</Text>

        {sent ? (
          <>
            <Text style={styles.successText}>
              Enviamos um e-mail com as instruções para redefinir sua senha.
            </Text>
            <Text style={styles.successHint}>
              Verifique sua caixa de entrada e a pasta de spam.
            </Text>
            <View style={authStyles.footer}>
              <Link href="/(auth)/login" style={authStyles.footerLink}>
                Voltar para o login
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text style={authStyles.subheading}>
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </Text>

            <AuthInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              errorText={emailError}
            />

            {formError ? (
              <Text style={authStyles.formError}>{formError}</Text>
            ) : null}

            <Button
              title="Enviar link de recuperação"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              buttonStyle={authStyles.submitButton}
            />

            <View style={authStyles.footer}>
              <Text style={authStyles.footerText}>Lembrou sua senha? </Text>
              <Link href="/(auth)/login" style={authStyles.footerLink}>
                Entrar
              </Link>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  successText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
  successHint: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});
