import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';

import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { openPdf } from '@/lib/openFile';
import { deleteDocument, documentFileExists, getDocument, renameDocument } from '@/lib/storage';
import { DocumentRecord } from '@/lib/types';

function formatDate(timestamp: number, localeTag: string): string {
  return new Date(timestamp).toLocaleDateString(localeTag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, localeTag } = useLanguage();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fileMissing, setFileMissing] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getDocument(id).then((doc) => {
        if (cancelled) return;
        if (doc) {
          setDocument(doc);
          setFileMissing(!documentFileExists(doc.pdfUri));
        } else {
          setNotFound(true);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [id])
  );

  function handleMissingFile() {
    if (!document) return;
    Alert.alert(t('document_missingFileTitle'), t('document_missingFileMessage'), [
      { text: t('common_cancel'), style: 'cancel' },
      {
        text: t('document_removeFromList'),
        style: 'destructive',
        onPress: async () => {
          await deleteDocument(document.id);
          router.back();
        },
      },
    ]);
  }

  async function handleOpen() {
    if (!document) return;
    if (fileMissing) {
      handleMissingFile();
      return;
    }
    try {
      await openPdf(document.pdfUri);
    } catch (error) {
      Alert.alert(t('document_openFailedTitle'), t('document_openFailedMessage'));
    }
  }

  async function handleShare() {
    if (!document) return;
    if (fileMissing) {
      handleMissingFile();
      return;
    }
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert(t('common_notSupportedTitle'), t('common_sharingNotAvailable'));
      return;
    }
    try {
      await Sharing.shareAsync(document.pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: document.name,
      });
    } catch (error) {
      Alert.alert(t('document_shareFailedTitle'), t('document_shareFailedMessage'));
    }
  }

  function handleOpenRename() {
    if (!document) return;
    setRenameValue(document.name);
    setRenameError(false);
    setIsRenaming(true);
  }

  async function handleConfirmRename() {
    if (!document) return;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenameError(true);
      return;
    }
    const updated = await renameDocument(document.id, trimmed);
    if (updated) setDocument(updated);
    setIsRenaming(false);
  }

  function handleDelete() {
    if (!document) return;
    Alert.alert(
      t('document_deleteConfirmTitle'),
      t('document_deleteConfirmMessage', { name: document.name }),
      [
        { text: t('common_cancel'), style: 'cancel' },
        {
          text: t('common_delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteDocument(document.id);
            router.back();
          },
        },
      ]
    );
  }

  if (notFound) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: t('nav_documentTitle') }} />
        <Text style={styles.notFoundText}>{t('document_notFound')}</Text>
      </View>
    );
  }

  if (!document) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: document.name }} />

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>PDF</Text>
        </View>
        <Text style={styles.name}>{document.name}</Text>
        <Text style={styles.meta}>
          {t('document_createdMeta', {
            count: document.pageCount,
            date: formatDate(document.createdAt, localeTag),
          })}
        </Text>
      </View>

      {fileMissing && (
        <View style={styles.missingBanner}>
          <Text style={styles.missingBannerText}>{t('document_missingFileMessage')}</Text>
          <Pressable onPress={handleMissingFile}>
            <Text style={styles.missingBannerAction}>{t('document_removeFromList')}</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, fileMissing && styles.buttonDisabled]}
          onPress={handleOpen}
        >
          <Text style={styles.primaryButtonText}>{t('document_open')}</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, fileMissing && styles.buttonDisabled]}
          onPress={handleShare}
        >
          <Text style={styles.secondaryButtonText}>{t('document_share')}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={handleOpenRename}>
          <Text style={styles.secondaryButtonText}>{t('document_rename')}</Text>
        </Pressable>
        <Pressable style={styles.dangerButton} onPress={handleDelete}>
          <Text style={styles.dangerButtonText}>{t('document_delete')}</Text>
        </Pressable>
      </View>

      <Modal visible={isRenaming} transparent animationType="fade" onRequestClose={() => setIsRenaming(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('document_renameTitle')}</Text>
            <TextInput
              value={renameValue}
              onChangeText={(text) => {
                setRenameValue(text);
                if (renameError) setRenameError(false);
              }}
              placeholder={t('document_renamePlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={[styles.modalInput, renameError && styles.modalInputError]}
              autoFocus
              selectTextOnFocus
              onSubmitEditing={handleConfirmRename}
              returnKeyType="done"
            />
            {renameError && <Text style={styles.modalErrorText}>{t('document_renameEmptyError')}</Text>}
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancelButton} onPress={() => setIsRenaming(false)}>
                <Text style={styles.secondaryButtonText}>{t('common_cancel')}</Text>
              </Pressable>
              <Pressable style={styles.modalSaveButton} onPress={handleConfirmRename}>
                <Text style={styles.primaryButtonText}>{t('common_save')}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 14,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  missingBanner: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    gap: 8,
  },
  missingBannerText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  missingBannerAction: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  dangerButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
  },
  modalInputError: {
    borderColor: colors.danger,
  },
  modalErrorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
});
