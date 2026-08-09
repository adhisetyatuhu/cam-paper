import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { DocumentRecord } from '@/lib/types';
import { ViewMode } from '@/lib/viewMode';

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
  viewMode,
  gridItemWidth,
  onPress,
}: {
  document: DocumentRecord;
  viewMode: ViewMode;
  gridItemWidth?: number;
  onPress: () => void;
}) {
  const { t, localeTag } = useLanguage();
  const dateText = formatDate(document.createdAt, localeTag);

  if (viewMode === 'grid') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.gridContainer,
          gridItemWidth ? { width: gridItemWidth } : null,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.gridIconWrap}>
          <Text style={styles.iconText}>PDF</Text>
        </View>
        <Text style={styles.gridName} numberOfLines={2}>
          {document.name}
        </Text>
      </Pressable>
    );
  }

  if (viewMode === 'compact') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.compactContainer, pressed && styles.pressed]}
      >
        <View style={styles.compactIconWrap}>
          <Text style={styles.compactIconText}>PDF</Text>
        </View>
        <Text style={styles.compactName} numberOfLines={1}>
          {document.name}
        </Text>
        <Text style={styles.compactDate} numberOfLines={1}>
          {dateText}
        </Text>
      </Pressable>
    );
  }

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
            date: dateText,
          })}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  iconText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 11,
  },

  // Detail layout (default)
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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

  // Compact layout
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    gap: 10,
  },
  compactIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIconText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 8,
  },
  compactName: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  compactDate: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 8,
  },

  // Grid layout
  gridContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 12,
    gap: 8,
  },
  gridIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
