import {
  colors,
  PrimaryButton,
  Screen,
} from "@/components/mvp-ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.multilineInput]}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
      />
    </View>
  );
}

export default function SubmitEvidenceScreen() {
  const [title, setTitle] = useState("完成 Lumbridge 烹飪練習");
  const [description, setDescription] = useState(
    "我在 Lumbridge 河邊捕捉生蝦，並在附近的營火完成烹煮。",
  );
  const [source, setSource] = useState("Personal activity log");

  return (
    <Screen
      title="提交 Evidence"
      subtitle="提供足以支持此 criterion 的基本文字資料。"
      footer={
        <PrimaryButton
          label="提交"
          onPress={() => router.push("/submit-result")}
        />
      }
    >
      <View style={styles.form}>
        <Field
          label="title"
          onChangeText={setTitle}
          placeholder="輸入 Evidence 標題"
          value={title}
        />
        <Field
          label="description"
          multiline
          onChangeText={setDescription}
          placeholder="描述你如何完成這個 criterion"
          value={description}
        />
        <Field
          label="source"
          onChangeText={setSource}
          placeholder="輸入 Evidence 來源"
          value={source}
        />
      </View>
      <Text style={styles.helperText}>
        第一版僅儲存文字內容，不包含圖片上傳與 Evidence type。
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 132,
    lineHeight: 23,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
