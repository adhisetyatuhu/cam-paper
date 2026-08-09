export type Language = 'id' | 'en';

export type TranslationKey = keyof typeof translations.id;

export const translations = {
  id: {
    nav_documentTitle: 'Dokumen',
    nav_settingsTitle: 'Pengaturan',
    nav_editDocumentTitle: 'Edit Halaman',

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
    document_editPages: 'Edit Halaman',
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

    editPages_addButton: '+ Tambah Halaman',
    editPages_pageLabel: 'Halaman {number}',
    editPages_replace: 'Ganti',
    editPages_delete: 'Hapus',
    editPages_minPagesTitle: 'Tidak Bisa Dihapus',
    editPages_minPagesMessage: 'Dokumen harus memiliki minimal 1 halaman.',
    editPages_deleteConfirmTitle: 'Hapus halaman?',
    editPages_deleteConfirmMessage: 'Halaman {number} akan dihapus dari dokumen.',
    editPages_saveFailedTitle: 'Gagal menyimpan perubahan',
    editPages_savingStatus: 'Menyimpan perubahan...',
    editPages_emptyHint: 'Belum ada halaman. Ketuk "Tambah Halaman" untuk memindai.',

    settings_language: 'Bahasa',
    settings_languageSystem: 'Ikuti Bahasa Perangkat',
    settings_languageSystemHint: 'Saat ini: {language}',
    settings_languageId: 'Bahasa Indonesia',
    settings_languageEn: 'English',

    settings_paperSize: 'Ukuran Kertas',
    settings_paperSizeA4: 'A4',
    settings_paperSizeLetter: 'Letter',
    settings_paperSizeLegal: 'Legal',
    settings_paperSizeF4: 'F4 (Folio)',

    viewMode_compact: 'Kompak',
    viewMode_detail: 'Detail',
    viewMode_grid: 'Ikon',
  },
  en: {
    nav_documentTitle: 'Document',
    nav_settingsTitle: 'Settings',
    nav_editDocumentTitle: 'Edit Pages',

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
    document_editPages: 'Edit Pages',
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

    editPages_addButton: '+ Add Page',
    editPages_pageLabel: 'Page {number}',
    editPages_replace: 'Replace',
    editPages_delete: 'Delete',
    editPages_minPagesTitle: 'Cannot Delete',
    editPages_minPagesMessage: 'The document must have at least 1 page.',
    editPages_deleteConfirmTitle: 'Delete page?',
    editPages_deleteConfirmMessage: 'Page {number} will be removed from the document.',
    editPages_saveFailedTitle: 'Failed to save changes',
    editPages_savingStatus: 'Saving changes...',
    editPages_emptyHint: 'No pages yet. Tap "Add Page" to scan.',

    settings_language: 'Language',
    settings_languageSystem: 'Follow Device Language',
    settings_languageSystemHint: 'Currently: {language}',
    settings_languageId: 'Bahasa Indonesia',
    settings_languageEn: 'English',

    settings_paperSize: 'Paper Size',
    settings_paperSizeA4: 'A4',
    settings_paperSizeLetter: 'Letter',
    settings_paperSizeLegal: 'Legal',
    settings_paperSizeF4: 'F4 (Folio)',

    viewMode_compact: 'Compact',
    viewMode_detail: 'Detail',
    viewMode_grid: 'Icons',
  },
} as const;

export const localeTag: Record<Language, string> = {
  id: 'id-ID',
  en: 'en-US',
};
