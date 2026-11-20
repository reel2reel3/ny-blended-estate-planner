import React, { useState } from 'react';
import { Save, X, Copy, Check, FolderOpen, Info } from 'lucide-react';

interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFileName: string;
  onSaveToDirectory: (fileName: string) => Promise<void>;
  onSaveWithPicker: (fileName: string) => Promise<void>;
  onDirectDownload: (fileName: string) => void;
}

export const SaveAsModal: React.FC<SaveAsModalProps> = ({
  isOpen,
  onClose,
  defaultFileName,
  onSaveToDirectory,
  onDirectDownload,
}) => {
  const [fileName, setFileName] = useState(defaultFileName);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFileName = (fileName.trim() || defaultFileName).trim();

  const handleCopyClipboard = () => {
    window.dispatchEvent(new CustomEvent('copy-plan-json'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Save className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Save Plan File to Your Computer</h3>
              <p className="text-xs text-slate-300">Save a backup JSON file to any folder on your hard drive</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label htmlFor="react-save-as-filename" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              File Name
            </label>
            <input
              id="react-save-as-filename"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Primary Action Card */}
          <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-900">Save Plan File to Computer</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">Recommended</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Downloads your complete client plan JSON file directly to your computer.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDirectDownload(currentFileName)}
              className="shrink-0 px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm cursor-pointer transition-colors"
            >
              Save / Download File
            </button>
          </div>

          {/* Clear Guide on How to Always Pick Exact Folder */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <FolderOpen className="w-4 h-4 text-amber-700" />
              <span>How to Pick an Exact Folder on Your Hard Drive (Windows &amp; Mac):</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Web browsers block websites inside preview frames from directly scanning your hard drive for security (which caused the <em>"folder access was blocked"</em> error).
              <br />
              To have your computer <strong>always open the Windows Explorer or Mac Finder folder selector</strong> when you click Save, turn on this 5-second browser setting:
            </p>
            <div className="space-y-1.5 pl-2 text-[11px] text-slate-800">
              <div className="p-2 rounded-lg bg-white border border-amber-200">
                <strong>Chrome &amp; Brave:</strong> Click <strong>⋮</strong> (top right) → <strong>Settings</strong> → <strong>Downloads</strong> → Turn <strong>ON</strong> <em>"Ask where to save each file before downloading"</em>.
              </div>
              <div className="p-2 rounded-lg bg-white border border-amber-200">
                <strong>Microsoft Edge:</strong> Click <strong>⋯</strong> (top right) → <strong>Settings</strong> → <strong>Downloads</strong> → Turn <strong>ON</strong> <em>"Ask me what to do with each download"</em>.
              </div>
              <div className="p-2 rounded-lg bg-white border border-amber-200">
                <strong>Firefox:</strong> Click <strong>☰</strong> → <strong>Settings</strong> → <strong>General</strong> → Check <em>"Always ask you where to save files"</em>.
              </div>
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold">
              ✓ With that setting turned on, clicking &ldquo;Save / Download File&rdquo; above will immediately open your computer&apos;s native file folder window so you can select Desktop, Documents, USB drive, or any folder!
            </p>
          </div>

          {/* Secondary Utilities: Copy JSON & Experimental Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Copy to Clipboard */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h5 className="text-xs font-bold text-slate-800">Copy JSON Data</h5>
                <p className="text-[10px] text-slate-500 truncate">Paste into Notepad and save anywhere</p>
              </div>
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Data'}
              </button>
            </div>

            {/* Experimental Picker with Safe Fallback */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h5 className="text-xs font-bold text-slate-800">Try OS File Dialog</h5>
                <p className="text-[10px] text-slate-500 truncate">Supported in top-level Chrome tabs</p>
              </div>
              <button
                type="button"
                onClick={() => onSaveToDirectory(currentFileName)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Try OS Dialog
              </button>
            </div>
          </div>

          {/* Footer Close */}
          <div className="flex justify-end pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
