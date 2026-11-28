// The ZIP reader and the export parser. Only ever imported with import() from
// hooks/useExportUpload.ts, when someone picks or drops an export: imported
// statically they put jszip and the parser on every homepage view.
export { parseExportFiles, parseExportZip } from '@ig-tracker/core';
