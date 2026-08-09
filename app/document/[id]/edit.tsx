import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { File } from 'expo-file-system';
import DocumentScanner, {
  ResponseType,
  ScanDocumentResponseStatus,
} from 'react-native-document-scanner-plugin';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { usePaperSize } from '@/lib/paperSize';
import { createPdfFromImages } from '@/lib/pdf';
import { getDocument, updateDocumentPages } from '@/lib/storage';

type PageSource = { type: 'existing'; uri: string } | { type: 'new'; base64: string };
type EditablePage = { key: string; source: PageSource };

function thumbnailUri(source: PageSource): string {
  return source.type === 'existing' ? source.uri : `data:image/jpeg;base64,${source.base64}`;
}

export default function EditPagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const { paperSize } = usePaperSize();

  const [pages, setPages] = useState<EditablePage[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savingText, setSavingText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDocument(id).then((doc) => {
      if (cancelled) return;
      if (!doc || !doc.pageUris?.length) {
        setNotFound(true);
        return;
      }
      setPages(
        doc.pageUris.map((uri, index) => ({
          key: `existing-${index}-${uri}`,
          source: { type: 'existing', uri },
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleReplace(index: number) {
    if (busy) return;
    setBusy(true);
    try {
      const { scannedImages, status } = await DocumentScanner.scanDocument({
        responseType: ResponseType.Base64,
        croppedImageQuality: 85,
        maxNumDocuments: 1,
      });
      if (status === ScanDocumentResponseStatus.Cancel || !scannedImages?.length) return;
      const base64 = scannedImages[0];
      setPages((prev) =>
        prev
          ? prev.map((page, i) =>
              i === index ? { key: `new-${Date.now()}`, source: { type: 'new', base64 } } : page
            )
          : prev
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(t('scan_failedTitle'), message);
    } finally {
      setBusy(false);
    }
  }

  async function handleAddPages() {
    if (busy) return;
    setBusy(true);
    try {
      const { scannedImages, status } = await DocumentScanner.scanDocument({
        responseType: ResponseType.Base64,
        croppedImageQuality: 85,
      });
      if (status === ScanDocumentResponseStatus.Cancel || !scannedImages?.length) return;
      const newPages: EditablePage[] = scannedImages.map((base64, i) => ({
        key: `new-${Date.now()}-${i}`,
        source: { type: 'new', base64 },
      }));
      setPages((prev) => (prev ? [...prev, ...newPages] : newPages));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(t('scan_failedTitle'), message);
    } finally {
      setBusy(false);
    }
  }

  function handleDelete(index: number) {
    if (!pages) return;
    if (pages.length <= 1) {
      Alert.alert(t('editPages_minPagesTitle'), t('editPages_minPagesMessage'));
      return;
    }
    Alert.alert(
      t('editPages_deleteConfirmTitle'),
      t('editPages_deleteConfirmMessage', { number: index + 1 }),
      [
        { text: t('common_cancel'), style: 'cancel' },
        {
          text: t('common_delete'),
          style: 'destructive',
          onPress: () => setPages((prev) => (prev ? prev.filter((_, i) => i !== index) : prev)),
        },
      ]
    );
  }

  async function handleSave() {
    if (busy || !pages || pages.length === 0) return;
    setBusy(true);
    setSavingText(t('editPages_savingStatus'));
    try {
      const pagesBase64 = await Promise.all(
        pages.map((page) =>
          page.source.type === 'new' ? page.source.base64 : new File(page.source.uri).base64()
        )
      );
      const pdfBase64 = await createPdfFromImages(pagesBase64, paperSize);
      const updated = await updateDocumentPages({ id, pagesBase64, pdfBase64 });
      if (!updated) throw new Error('Document not found');
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert(t('editPages_saveFailedTitle'), message);
    } finally {
      setBusy(false);
      setSavingText(null);
    }
  }

  if (notFound) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: t('nav_editDocumentTitle') }} />
        <Text style={styles.notFoundText}>{t('document_notFound')}</Text>
      </View>
    );
  }

  if (!pages) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('nav_editDocumentTitle'),
          headerLeft: () => (
            <Pressable hitSlop={12} disabled={busy} onPress={() => router.back()}>
              <Text style={[styles.headerActionText, busy && styles.headerActionDisabled]}>
                {t('common_cancel')}
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable hitSlop={12} disabled={busy} onPress={handleSave}>
              <Text
                style={[
                  styles.headerActionText,
                  styles.headerSaveText,
                  busy && styles.headerActionDisabled,
                ]}
              >
                {t('common_save')}
              </Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={pages}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        keyExtractor={(page) => page.key}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              (pressed || busy) && styles.addButtonDisabled,
            ]}
            disabled={busy}
            onPress={handleAddPages}
          >
            <Text style={styles.addButtonText}>{t('editPages_addButton')}</Text>
          </Pressable>
        }
        ListEmptyComponent={<Text style={styles.emptyHint}>{t('editPages_emptyHint')}</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.pageCard}>
            <Image source={{ uri: thumbnailUri(item.source) }} style={styles.pageImage} />
            <Text style={styles.pageLabel}>{t('editPages_pageLabel', { number: index + 1 })}</Text>
            <View style={styles.pageActions}>
              <Pressable
                style={styles.pageActionButton}
                disabled={busy}
                onPress={() => handleReplace(index)}
              >
                <Text style={styles.pageActionText}>{t('editPages_replace')}</Text>
              </Pressable>
              <Pressable
                style={styles.pageActionButton}
                disabled={busy}
                onPress={() => handleDelete(index)}
              >
                <Text style={[styles.pageActionText, styles.pageActionDanger]}>
                  {t('editPages_delete')}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {savingText && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.savingText}>{savingText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  headerActionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  headerSaveText: {
    color: colors.primary,
    fontWeight: '700',
  },
  headerActionDisabled: {
    opacity: 0.4,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  gridRow: {
    gap: 12,
  },
  addButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
  pageCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  pageImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
  },
  pageLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  pageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pageActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  pageActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  pageActionDanger: {
    color: colors.danger,
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  savingText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
