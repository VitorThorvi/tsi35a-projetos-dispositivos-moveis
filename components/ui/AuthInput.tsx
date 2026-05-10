import { Input } from "@rneui/themed";

type AuthInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  errorText?: string;
};

export function AuthInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  errorText,
}: AuthInputProps) {
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      errorMessage={errorText}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}
