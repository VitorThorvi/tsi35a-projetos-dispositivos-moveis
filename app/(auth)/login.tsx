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
import { colors } from "../../constants/theme";
import { useAuthStore } from "../../stores/useAuthStore";

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [senhaError, setSenhaError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setEmailError(undefined);
    setSenhaError(undefined);
    setSubmitting(true);
    try {
      await login(email, senha);
    } catch (err) {
      if (err instanceof ZodError) {
        for (const issue of err.issues) {
          const field = issue.path[0];
          if (field === "email") setEmailError(issue.message);
          if (field === "password") setSenhaError(issue.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.heading}>Bem-vindo</Text>
        <Text style={styles.subheading}>
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

        <Button
          title="Entrar"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonStyle={styles.submitButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem conta? </Text>
          <Link href="/(auth)/login" style={styles.footerLink}>
            Cadastre-se
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  form: { gap: 8 },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  submitButton: { marginTop: 8, paddingVertical: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: { color: colors.textSecondary },
  footerLink: { color: colors.primary, fontWeight: "600" },
});
