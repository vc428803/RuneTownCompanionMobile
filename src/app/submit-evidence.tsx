import { submitEvidence } from "@/api/client";
import { colors, PrimaryButton, Screen } from "@/components/mvp-ui";
import { router, useLocalSearchParams } from "expo-router";
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
        autoCapitalize="sentences"
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
  const { goalId, criterionId } = useLocalSearchParams<{
    goalId?: string;
    criterionId?: string;
  }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!goalId || !criterionId) {
      setError("缺少 goalId 或 criterionId，無法提交 Evidence。");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError("title 與 description 不可留白。");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await submitEvidence(goalId, criterionId, {
        title: title.trim(),
        description: description.trim(),
        source: source.trim(),
      });

      router.replace({
        pathname: "/submit-result",
        params: {
          accepted: String(result.accepted),
          criterionCompleted: String(result.criterionCompleted),
          criterionId: result.criterionId,
          goalId: result.goalId,
          goalStatus: result.goalStatus,
        },
      });
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "提交 Evidence 時發生未知錯誤。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen
      title="提交 Evidence"
      subtitle="提供足以支持此 Criterion 的文字資料。"
      footer={
        <PrimaryButton
          disabled={isSubmitting}
          label={isSubmitting ? "提交中…" : "提交"}
          onPress={handleSubmit}
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
          placeholder="描述這筆 Evidence 如何滿足 Criterion"
          value={description}
        />
        <Field
          label="source"
          onChangeText={setSource}
          placeholder="輸入來源文字或網址"
          value={source}
        />
      </View>
      {error ? (
        <Text accessibilityLiveRegion="assertive" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
      <Text style={styles.helperText}>
        title 與 description 不可留白。source 會以一般文字送出，不保證是網址。
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
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 20,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
