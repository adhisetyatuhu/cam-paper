import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import DocumentScanner, {
  ResponseType,
  ScanDocumentResponseStatus,
} from 'react-native-document-scanner-plugin';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';
import { createPdfFromImages } from '@/lib/pdf';
import { saveDocument } from '@/lib/storage';

type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

function defaultDocumentName(t: Translate, localeTag: string): string {
  const now = new Date();
  const date = now.toLocaleDateString(localeTag, { day: 'numeric', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString(localeTag, { hour: '2-digit', minute: '2-digit' });
  return t('document_defaultName', { date, time });
}

export default function CameraScreen() {
  const { t, localeTag } = useLanguage();
  const [statusText, setStatusText] = useState(t('scan_opening'));
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runScan();
  }, []);

  async function runScan() {
    try {
      // scanDocument opens a native full-screen flow: live edge detection,
      // capture, a built-in review screen for dragging corners manually,
      // and native looping for additional pages until the user taps "Done".
      const { scannedImages, status } = await DocumentScanner.scanDocument({
        responseType: ResponseType.Base64,
        croppedImageQuality: 85,
      });

      if (status === ScanDocumentResponseStatus.Cancel || !scannedImages?.length) {
        router.back();
        return;
      }

      setStatusText(t('scan_generating'));
      const pdfBase64 = await createPdfFromImages(scannedImages);
      const document = await saveDocument({
        name: defaultDocumentName(t, localeTag),
        pdfBase64,
        pageCount: scannedImages.length,
      });
      router.replace(`/document/${document.id}`);
    } catch (error) {
      console.error('runScan failed', error);
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(t('scan_failedTitle'), message, [{ text: t('common_ok'), onPress: () => router.back() }]);
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
