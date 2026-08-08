import { Pressable, Text } from 'react-native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';
import { LanguageProvider, useLanguage } from '@/lib/i18n/LanguageProvider';

function SettingsButton() {
  return (
    <Pressable hitSlop={12} onPress={() => router.push('/settings')}>
      <Text style={{ fontSize: 20 }}>⚙️</Text>
    </Pressable>
  );
}

function RootStack() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'CamPaper', headerRight: SettingsButton }} />
      <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="document/[id]" options={{ title: t('nav_documentTitle') }} />
      <Stack.Screen name="settings" options={{ title: t('nav_settingsTitle') }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <StatusBar style="light" />
      <RootStack />
    </LanguageProvider>
  );
}
