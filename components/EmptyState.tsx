import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function EmptyState() {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home_emptyTitle')}</Text>
      <Text style={styles.subtitle}>{t('home_emptySubtitle')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
