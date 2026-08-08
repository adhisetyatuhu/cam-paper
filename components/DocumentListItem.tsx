import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { DocumentRecord } from '@/lib/types';

function formatDate(timestamp: number, localeTag: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(localeTag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DocumentListItem({
  document,
  onPress,
}: {
  document: DocumentRecord;
  onPress: () => void;
}) {
  const { t, localeTag } = useLanguage();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.iconText}>PDF</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {document.name}
        </Text>
        <Text style={styles.meta}>
          {t('document_listMeta', {
            count: document.pageCount,
            date: formatDate(document.createdAt, localeTag),
          })}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 11,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
