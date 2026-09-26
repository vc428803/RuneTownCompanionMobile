import { Href, Link } from "expo-router";
import { PropsWithChildren } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

type InfoCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  detail?: string;
};

type PrimaryLinkProps = {
  href: Href;
  label: string;
};

export function Screen({ title, subtitle, children }: ScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

export function InfoCard({
  eyebrow,
  title,
  description,
  detail,
}: InfoCardProps) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

export function PrimaryLink({ href, label }: PrimaryLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    gap: 20,
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  heading: {
    gap: 8,
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    gap: 8,
    padding: 18,
    borderColor: "#d1d5db",
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  eyebrow: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "600",
  },
  cardDescription: {
    color: "#4b5563",
    fontSize: 15,
    lineHeight: 22,
  },
  detail: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },
  primaryButtonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
