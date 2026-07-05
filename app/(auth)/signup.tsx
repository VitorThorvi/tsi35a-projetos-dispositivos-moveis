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
import { authErrorMessage } from "../../utils/authErrorMessages";

function firebaseErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

export default function SignupScreen() {
  const signup = useAuthStore((s) => s.signup);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nomeError, setNomeError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [senhaError, setSenhaError] = useState<string | undefined>();
  const [confirmarSenhaError, setConfirmarSenhaError] = useState<
    string | undefined
  >();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setNomeError(undefined);
    setEmailError(undefined);
    setSenhaError(undefined);
    setConfirmarSenhaError(undefined);
    setFormError(undefined);
    setSubmitting(true);
    try {
      await signup(nome, email, senha, confirmarSenha);
    } catch (err) {
      if (err instanceof ZodError) {
        for (const issue of err.issues) {
          const field = issue.path[0];
          if (field === "name") setNomeError("Informe seu nome.");
          else if (field === "email") setEmailError("E-mail inválido.");
          else if (field === "password")
            setSenhaError("A senha deve ter ao menos 6 caracteres.");
          else if (field === "confirmPassword")
            setConfirmarSenhaError(issue.message);
        }
      } else {
        const code = firebaseErrorCode(err);
        setFormError(
          code
            ? authErrorMessage(code)
            : "Não foi possível criar a conta. Tente novamente.",
        );
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
        <Text style={styles.heading}>Crie sua conta</Text>
        <Text style={styles.subheading}>
          Preencha os dados abaixo para se cadastrar
        </Text>

        <AuthInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          errorText={nomeError}
        />
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
        <AuthInput
          label="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          errorText={confirmarSenhaError}
        />

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <Button
          title="Criar conta"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonStyle={styles.submitButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <Link href="/(auth)/login" style={styles.footerLink}>
            Entrar
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
  formError: {
    color: colors.error,
    fontSize: 14,
    textAlign: "center",
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
