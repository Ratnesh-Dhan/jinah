import { safeRename } from '../services/';

/**
 * Tool to rename files safely within the filesystem service.
 * This is just an example of how you'd call our renamed function in another tool!
 */
export const renameFileTool = (sourcePath: string, newName: string): Promise<boolean> => {
    console.log('🔍 [rename-file-tool] Starting file renaming operation...'); // Log for debugging
    
    return safeRename(sourcePath, newName).catch(err => {
        console.error(`❌ Error while trying to rename ${sourcePath} → ${newName}:`, err.message);
        
        if (err instanceof Error) {
            switch (err.name || 'UNKNOWN') {
                case 'FilenotFoundError': // Our custom error name? No wait, that's not standard. Let me check our code... Actually it doesn't use throw statements so the errors bubble up differently. Let me just catch whatever comes through from safeRename()
                    break;
            }
        }
        
        return false;
    });
};

export default renameFileTool as any; // Just to make TypeScript happy if you want a direct import
