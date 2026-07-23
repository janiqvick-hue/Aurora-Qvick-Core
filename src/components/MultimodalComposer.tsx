import React, { useState, useRef, FormEvent, DragEvent, ChangeEvent } from "react";
import { 
  Paperclip, 
  Image as ImageIcon, 
  FolderPlus, 
  Mic, 
  Send, 
  X, 
  FileText, 
  FileCode, 
  FileArchive, 
  File, 
  Folder, 
  AlertCircle,
  Loader2
} from "lucide-react";

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'document' | 'code' | 'zip' | 'folder' | 'other';
  mimeType: string;
  previewUrl?: string;
  content?: string;
  base64?: string;
  fileCount?: number;
  folderPath?: string;
  filesSummary?: { name: string; size: number; path: string; content?: string }[];
  status: 'uploading' | 'ready' | 'error';
  progress: number;
  errorMessage?: string;
}

interface MultimodalComposerProps {
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  isListeningSpeech: boolean;
  startSpeechRecognition: () => void;
  onSendMessage: (text: string, attachments: ChatAttachment[]) => void;
  onFocusInput?: () => void;
}

const MAX_FILE_SIZE_MB = 15;

export default function MultimodalComposer({
  input,
  setInput,
  loading,
  isListeningSpeech,
  startSpeechRecognition,
  onSendMessage,
  onFocusInput
}: MultimodalComposerProps) {
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine file category type
  const detectFileType = (file: File): ChatAttachment['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mime = file.type.toLowerCase();

    if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return 'image';
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mime.includes('zip') || mime.includes('compressed')) {
      return 'zip';
    }
    if (['ts', 'tsx', 'js', 'jsx', 'cs', 'py', 'cpp', 'c', 'h', 'html', 'css', 'go', 'rs', 'java', 'json', 'yaml', 'yml', 'sh'].includes(ext)) {
      return 'code';
    }
    if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf', 'csv'].includes(ext) || mime.includes('pdf') || mime.includes('word')) {
      return 'document';
    }
    return 'other';
  };

  // Format file size nicely
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.size > 1024 * 1024 * 3) {
        resolve(`[Tiedosto "${file.name}" koko (${formatFileSize(file.size)}) ylittää 3MB katselurajan]`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => resolve(`[Virhe luettaessa tiedostoa ${file.name}]`);
      reader.readAsText(file);
    });
  };

  // Helper to read file as DataURL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Process raw File objects into ChatAttachment items
  const processFiles = async (files: File[], folderName?: string) => {
    if (files.length === 0) return;
    setIsProcessing(true);

    if (folderName) {
      // Grouping as a Folder Attachment
      const folderId = `folder-${Date.now()}`;
      let totalFolderSize = 0;
      const fileSummaries: { name: string; size: number; path: string; content?: string }[] = [];

      for (let i = 0; i < Math.min(files.length, 50); i++) {
        const file = files[i];
        totalFolderSize += file.size;
        const fileType = detectFileType(file);
        let content: string | undefined = undefined;
        if (fileType === 'code' || fileType === 'document') {
          content = await readFileAsText(file);
        }
        fileSummaries.push({
          name: file.name,
          size: file.size,
          path: file.webkitRelativePath || file.name,
          content
        });
      }

      const newFolderAttachment: ChatAttachment = {
        id: folderId,
        name: folderName,
        size: totalFolderSize,
        type: 'folder',
        mimeType: 'folder/directory',
        fileCount: files.length,
        folderPath: folderName,
        filesSummary: fileSummaries,
        status: 'ready',
        progress: 100
      };

      setAttachments(prev => [...prev, newFolderAttachment]);
      setIsProcessing(false);
      return;
    }

    // Process individual files
    for (const file of files) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const fileType = detectFileType(file);

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setAttachments(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: file.size,
          type: fileType,
          mimeType: file.type || 'application/octet-stream',
          status: 'error',
          progress: 0,
          errorMessage: `Liian suuri tiedosto (max ${MAX_FILE_SIZE_MB}MB)`
        }]);
        continue;
      }

      // Add temporary loading item
      const newAtt: ChatAttachment = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: fileType,
        mimeType: file.type || 'application/octet-stream',
        status: 'uploading',
        progress: 30
      };

      setAttachments(prev => [...prev, newAtt]);

      // Read contents according to file type
      if (fileType === 'image') {
        const dataUrl = await readFileAsDataURL(file);
        setAttachments(prev => prev.map(a => a.id === fileId ? {
          ...a,
          previewUrl: dataUrl,
          base64: dataUrl,
          status: 'ready',
          progress: 100
        } : a));
      } else if (fileType === 'code' || fileType === 'document') {
        const textContent = await readFileAsText(file);
        setAttachments(prev => prev.map(a => a.id === fileId ? {
          ...a,
          content: textContent,
          status: 'ready',
          progress: 100
        } : a));
      } else {
        // Zip or other
        setAttachments(prev => prev.map(a => a.id === fileId ? {
          ...a,
          status: 'ready',
          progress: 100
        } : a));
      }
    }

    setIsProcessing(false);
  };

  // Drag and drop event handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate drag if target left outer box
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (onFocusInput) onFocusInput();

    const items = e.dataTransfer.items;
    const droppedFiles: File[] = [];

    if (items && items.length > 0) {
      const folderFiles: File[] = [];
      let detectedFolderName = "";

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
          if (entry && entry.isDirectory) {
            detectedFolderName = entry.name;
            // Recursive scan
            const readEntry = async (dirEntry: any, pathPrefix = "") => {
              const dirReader = dirEntry.createReader();
              const entries: any[] = await new Promise((res) => dirReader.readEntries(res));
              for (const childEntry of entries) {
                if (childEntry.isFile) {
                  const file: File = await new Promise((res) => childEntry.file(res));
                  folderFiles.push(file);
                } else if (childEntry.isDirectory) {
                  await readEntry(childEntry, `${pathPrefix}/${childEntry.name}`);
                }
              }
            };
            await readEntry(entry, entry.name);
          } else {
            const file = item.getAsFile();
            if (file) droppedFiles.push(file);
          }
        }
      }

      if (folderFiles.length > 0) {
        await processFiles(folderFiles, detectedFolderName || "Liitekansio");
      }
    }

    if (droppedFiles.length > 0) {
      await processFiles(droppedFiles);
    }
  };

  // Handle standard input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      processFiles(filesArray);
      e.target.value = "";
    }
  };

  // Handle folder input change
  const handleFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      // Extract folder name from webkitRelativePath
      const firstPath = filesArray[0]?.webkitRelativePath || "";
      const folderName = firstPath.split('/')[0] || "HankeKansio";
      processFiles(filesArray, folderName);
      e.target.value = "";
    }
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || loading) return;

    onSendMessage(input.trim(), attachments);
    setAttachments([]);
  };

  // Render attachment icon based on type
  const renderTypeIcon = (att: ChatAttachment) => {
    switch (att.type) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-amber-400" />;
      case 'code':
        return <FileCode className="w-3.5 h-3.5 text-emerald-400" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-sky-400" />;
      case 'zip':
        return <FileArchive className="w-3.5 h-3.5 text-purple-400" />;
      case 'folder':
        return <Folder className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <File className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  return (
    <div 
      className="relative w-full font-serif"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleFileChange} 
        multiple 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={folderInputRef} 
        onChange={handleFolderChange} 
        multiple 
        {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        className="hidden" 
      />

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-40 bg-[#120a04]/95 border-2 border-dashed border-[#d4af37] rounded-xl flex flex-col items-center justify-center p-4 text-center backdrop-blur-md animate-fadeIn shadow-2xl pointer-events-none">
          <FolderPlus className="w-8 h-8 text-[#d4af37] animate-bounce mb-2" />
          <p className="text-sm font-bold text-amber-200">Pudota liitteet tai kansio tähän</p>
          <p className="text-xs text-stone-400 mt-1">Aurora tutkii kuvat, koodit, dokumentit ja hanke-kansiot välittömästi.</p>
        </div>
      )}

      <div className="bg-[#0b0603]/85 border border-[#3d2b1d]/70 rounded-xl backdrop-blur-xl p-2.5 shadow-2xl space-y-2">
        
        {/* Removable Attachment Chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 bg-[#140b05] border border-[#3d2b1d]/80 rounded-lg max-h-[120px] overflow-y-auto custom-scrollbar">
            {attachments.map((att) => (
              <div 
                key={att.id} 
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-all ${
                  att.status === 'error' 
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300' 
                    : 'bg-[#0b0603] border-[#3d2b1d] text-stone-200 hover:border-amber-500/40'
                }`}
              >
                {att.previewUrl ? (
                  <img src={att.previewUrl} alt={att.name} className="w-5 h-5 rounded object-cover border border-[#3d2b1d]" />
                ) : (
                  renderTypeIcon(att)
                )}

                <div className="flex flex-col max-w-[140px] truncate">
                  <span className="truncate font-medium text-[11px]">{att.name}</span>
                  <span className="text-[9px] font-mono text-stone-400">
                    {att.type === 'folder' 
                      ? `${att.fileCount} tiedostoa (${formatFileSize(att.size)})`
                      : formatFileSize(att.size)}
                  </span>
                </div>

                {att.status === 'uploading' && (
                  <Loader2 className="w-3 h-3 text-amber-400 animate-spin shrink-0" />
                )}

                {att.status === 'error' && (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" title={att.errorMessage} />
                )}

                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="p-0.5 rounded text-stone-400 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                  title="Poista liite"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input & Action Icons Console */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-0.5">
          {/* Action Icons Group */}
          <div className="flex items-center gap-1">
            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg border bg-[#140b05] border-[#3d2b1d] text-stone-400 hover:text-amber-300 hover:border-[#d4af37]/50 transition-all cursor-pointer"
              title="Liitä tiedosto (PDF, DOCX, TXT, Koodi, ZIP)"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>

            {/* Attach Images Button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-lg border bg-[#140b05] border-[#3d2b1d] text-stone-400 hover:text-amber-300 hover:border-[#d4af37]/50 transition-all cursor-pointer"
              title="Liitä kuvat / kuvakaappaukset"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Attach Folder Button */}
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="p-2 rounded-lg border bg-[#140b05] border-[#3d2b1d] text-stone-400 hover:text-amber-300 hover:border-[#d4af37]/50 transition-all cursor-pointer"
              title="Liitä hanke-kansio"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>

            {/* Speech Microphone Button */}
            <button
              type="button"
              onClick={startSpeechRecognition}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isListeningSpeech
                  ? "bg-rose-500/30 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse"
                  : "bg-[#140b05] border-[#3d2b1d] text-stone-400 hover:text-amber-300 hover:border-[#d4af37]/50"
              }`}
              title="Puhu Auroralle (Mikrofoni)"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { if (onFocusInput) onFocusInput(); }}
            placeholder={attachments.length > 0 ? "Kirjoita saatesana liitteille tai kysy..." : "Kirjoita tai liitä tiedostoja Auroralle mökillä..."}
            className="flex-1 bg-[#140b05] border border-[#3d2b1d] focus:border-[#d4af37] rounded-lg px-3.5 py-1.5 text-xs text-stone-200 focus:outline-none font-serif placeholder:text-stone-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || loading || isProcessing}
            className="p-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-300 rounded-lg hover:bg-[#d4af37]/35 transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center shrink-0"
            title="Lähetä viesti ja liitteet"
          >
            {isProcessing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
