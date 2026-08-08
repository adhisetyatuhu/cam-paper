import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { LanguagePreference, useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';

const LANGUAGE_OPTIONS: { value: LanguagePreference; labelKey: TranslationKey }[] = [
  { value: 'system', labelKey: 'settings_languageSystem' },
  { value: 'id', labelKey: 'settings_languageId' },
  { value: 'en', labelKey: 'settings_languageEn' },
];

export default function SettingsScreen() {
  const { preference, language, setPreference, t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('settings_language')}</Text>
      <View style={styles.card}>
        {LANGUAGE_OPTIONS.map((option, index) => {
          const selected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.row, index < LANGUAGE_OPTIONS.length - 1 && styles.rowBorder]}
              onPress={() => setPreference(option.value)}
            >
              <View>
                <Text style={styles.rowLabel}>{t(option.labelKey)}</Text>
                {option.value === 'system' && (
                  <Text style={styles.rowHint}>
                    {t('settings_languageSystemHint', {
                      language: language === 'id' ? t('settings_languageId') : t('settings_languageEn'),
                    })}
                  </Text>
                )}
              </View>
              {selected && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  rowHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
