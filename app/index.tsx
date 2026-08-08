import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DocumentListItem } from '@/components/DocumentListItem';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { listDocuments } from '@/lib/storage';
import { DocumentRecord } from '@/lib/types';

export default function HomeScreen() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      listDocuments().then((docs) => {
        if (!cancelled) setDocuments(docs);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          documents.length === 0 ? styles.emptyList : styles.list,
          { paddingBottom: (documents.length === 0 ? 0 : 96) + insets.bottom },
        ]}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <DocumentListItem
            document={item}
            onPress={() => router.push(`/document/${item.id}`)}
          />
        )}
      />
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: 20 + insets.bottom },
          pressed && styles.fabPressed,
        ]}
        onPress={() => router.push('/camera')}
      >
        <Text style={styles.fabText}>{t('home_scanButton')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
  },
  fabText: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 15,
  },
});
