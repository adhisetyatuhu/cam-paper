import { Platform } from 'react-native';
import { File } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';

const FLAG_GRANT_READ_URI_PERMISSION = 1;

/**
 * Opens a local PDF in an external viewer app.
 *
 * On Android, ACTION_VIEW requires a content:// URI (file:// is blocked by
 * FileProvider security since Android 7) with explicit read permission
 * granted to the receiving app.
 */
export async function openPdf(pdfUri: string): Promise<void> {
  if (Platform.OS === 'android') {
    const contentUri = new File(pdfUri).contentUri;
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: FLAG_GRANT_READ_URI_PERMISSION,
      type: 'application/pdf',
    });
    return;
  }

  await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf' });
}
