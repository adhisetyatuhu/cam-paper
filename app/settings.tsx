import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { LanguagePreference, useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';
import { PaperSize, usePaperSize } from '@/lib/paperSize';

const LANGUAGE_OPTIONS: { value: LanguagePreference; labelKey: TranslationKey }[] = [
  { value: 'system', labelKey: 'settings_languageSystem' },
  { value: 'id', labelKey: 'settings_languageId' },
  { value: 'en', labelKey: 'settings_languageEn' },
];

const PAPER_SIZE_OPTIONS: { value: PaperSize; labelKey: TranslationKey }[] = [
  { value: 'a4', labelKey: 'settings_paperSizeA4' },
  { value: 'letter', labelKey: 'settings_paperSizeLetter' },
  { value: 'legal', labelKey: 'settings_paperSizeLegal' },
  { value: 'f4', labelKey: 'settings_paperSizeF4' },
];

export default function SettingsScreen() {
  const { preference, language, setPreference, t } = useLanguage();
  const { paperSize, setPaperSize } = usePaperSize();

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

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>{t('settings_paperSize')}</Text>
      <View style={styles.card}>
        {PAPER_SIZE_OPTIONS.map((option, index) => {
          const selected = paperSize === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.row, index < PAPER_SIZE_OPTIONS.length - 1 && styles.rowBorder]}
              onPress={() => setPaperSize(option.value)}
            >
              <Text style={styles.rowLabel}>{t(option.labelKey)}</Text>
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
  sectionSpacing: {
    marginTop: 24,
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
