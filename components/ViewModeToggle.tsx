import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';
import { useViewMode, ViewMode } from '@/lib/viewMode';

const OPTIONS: { mode: ViewMode; icon: string; labelKey: TranslationKey }[] = [
  { mode: 'compact', icon: '☰', labelKey: 'viewMode_compact' },
  { mode: 'detail', icon: '▤', labelKey: 'viewMode_detail' },
  { mode: 'grid', icon: '▦', labelKey: 'viewMode_grid' },
];

export function ViewModeToggle() {
  const { mode, setMode } = useViewMode();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const selected = mode === option.mode;
        return (
          <Pressable
            key={option.mode}
            hitSlop={8}
            accessibilityLabel={t(option.labelKey)}
            onPress={() => setMode(option.mode)}
            style={[styles.button, selected && styles.buttonSelected]}
          >
            <Text style={[styles.icon, selected && styles.iconSelected]}>{option.icon}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.surfaceAlt,
  },
  icon: {
    fontSize: 15,
    color: colors.textMuted,
  },
  iconSelected: {
    color: colors.primary,
  },
});
