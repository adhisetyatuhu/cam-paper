export type Language = 'id' | 'en';

export type TranslationKey = keyof typeof translations.id;

export const translations = {
  id: {
    nav_documentTitle: 'Dokumen',
    nav_settingsTitle: 'Pengaturan',

    home_scanButton: '+ Scan Baru',
    home_emptyTitle: 'Belum ada dokumen',
    home_emptySubtitle:
      'Ketuk tombol "Scan Baru" untuk memfoto dokumen pertamamu dan mengubahnya menjadi PDF.',

    document_listMeta: '{count} halaman · {date}',
    document_createdMeta: '{count} halaman · dibuat {date}',
    document_defaultName: 'Dokumen {date} {time}',
    document_notFound: 'Dokumen tidak ditemukan.',
    document_open: 'Buka File',
    document_share: 'Bagikan / Simpan',
    document_rename: 'Ganti Nama',
    document_delete: 'Hapus Dokumen',
    document_openFailedTitle: 'Tidak bisa membuka file',
    document_openFailedMessage:
      'Tidak ditemukan aplikasi pembuka PDF di perangkat ini. Coba bagikan filenya sebagai gantinya.',
    document_deleteConfirmTitle: 'Hapus dokumen?',
    document_deleteConfirmMessage: '"{name}" akan dihapus secara permanen.',
    document_renameTitle: 'Ganti Nama Dokumen',
    document_renamePlaceholder: 'Nama dokumen',
    document_renameEmptyError: 'Nama dokumen tidak boleh kosong.',
    document_missingFileTitle: 'File tidak ditemukan',
    document_missingFileMessage:
      'File PDF untuk dokumen ini tidak ditemukan. Mungkin sudah dihapus atau dipindahkan di luar aplikasi.',
    document_removeFromList: 'Hapus dari Daftar',
    document_shareFailedTitle: 'Gagal membagikan file',
    document_shareFailedMessage: 'Terjadi kesalahan saat mencoba membagikan file ini.',

    common_cancel: 'Batal',
    common_delete: 'Hapus',
    common_save: 'Simpan',
    common_ok: 'OK',
    common_notSupportedTitle: 'Tidak didukung',
    common_sharingNotAvailable: 'Fitur berbagi tidak tersedia di perangkat ini.',

    scan_opening: 'Membuka kamera...',
    scan_generating: 'Membuat PDF...',
    scan_failedTitle: 'Gagal memindai dokumen',

    settings_language: 'Bahasa',
    settings_languageSystem: 'Ikuti Bahasa Perangkat',
    settings_languageSystemHint: 'Saat ini: {language}',
    settings_languageId: 'Bahasa Indonesia',
    settings_languageEn: 'English',
  },
  en: {
    nav_documentTitle: 'Document',
    nav_settingsTitle: 'Settings',

    home_scanButton: '+ New Scan',
    home_emptyTitle: 'No documents yet',
    home_emptySubtitle: 'Tap "New Scan" to photograph your first document and turn it into a PDF.',

    document_listMeta: '{count} pages · {date}',
    document_createdMeta: '{count} pages · created {date}',
    document_defaultName: 'Document {date} {time}',
    document_notFound: 'Document not found.',
    document_open: 'Open File',
    document_share: 'Share / Save',
    document_rename: 'Rename',
    document_delete: 'Delete Document',
    document_openFailedTitle: 'Cannot open file',
    document_openFailedMessage: 'No PDF viewer app was found on this device. Try sharing the file instead.',
    document_deleteConfirmTitle: 'Delete document?',
    document_deleteConfirmMessage: '"{name}" will be permanently deleted.',
    document_renameTitle: 'Rename Document',
    document_renamePlaceholder: 'Document name',
    document_renameEmptyError: 'Document name cannot be empty.',
    document_missingFileTitle: 'File not found',
    document_missingFileMessage:
      'The PDF file for this document could not be found. It may have been deleted or moved outside the app.',
    document_removeFromList: 'Remove from List',
    document_shareFailedTitle: 'Failed to share file',
    document_shareFailedMessage: 'Something went wrong while trying to share this file.',

    common_cancel: 'Cancel',
    common_delete: 'Delete',
    common_save: 'Save',
    common_ok: 'OK',
    common_notSupportedTitle: 'Not supported',
    common_sharingNotAvailable: 'Sharing is not available on this device.',

    scan_opening: 'Opening camera...',
    scan_generating: 'Creating PDF...',
    scan_failedTitle: 'Failed to scan document',

    settings_language: 'Language',
    settings_languageSystem: 'Follow Device Language',
    settings_languageSystemHint: 'Currently: {language}',
    settings_languageId: 'Bahasa Indonesia',
    settings_languageEn: 'English',
  },
} as const;

export const localeTag: Record<Language, string> = {
  id: 'id-ID',
  en: 'en-US',
};
