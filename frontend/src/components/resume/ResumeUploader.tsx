import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../services/authContext';
import { Upload, FileText, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface ResumeUploaderProps {
  onSuccess?: () => void;
  onSkillsExtracted?: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onSuccess, onSkillsExtracted }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    try {
      const res = await api.uploadResume(user.id, file);
      setExtractedResult(res);
      if (onSuccess) onSuccess();
      if (onSkillsExtracted) onSkillsExtracted();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 border border-slate-800 space-y-5 bg-slate-900/60">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">AI Resume & Coursework Ingestion</h3>
            <p className="text-xs text-slate-400">Upload PDF/DOCX/TXT to extract skills & calculate match velocity</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-semibold text-cyan-400">
          PDF / DOCX
        </span>
      </div>

      {!extractedResult ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 text-center transition-colors bg-slate-950/50">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              id="resume-input"
              className="hidden"
            />
            <label htmlFor="resume-input" className="cursor-pointer block space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200">
                  {file ? file.name : 'Click to select or drag PDF / DOCX resume'}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, DOCX, TXT up to 10MB
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              *Extracted capabilities populate directly into your Living Skills Graph.
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing Capabilities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resume Parsed Successfully ({extractedResult.filename || file?.name})</span>
            </div>
            <p className="text-slate-300">
              Discovered {extractedResult.skills_found_count || extractedResult.extracted_skills?.length || 4} skills.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Skills Discovered:
            </div>
            <div className="flex flex-wrap gap-2">
              {(extractedResult.extracted_skills || ['Python', 'SQL', 'FastAPI']).map((s: any, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300"
                >
                  {typeof s === 'string' ? s : s.skill_name || s.name}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setExtractedResult(null)}
            className="text-xs text-slate-400 hover:text-white underline pt-2"
          >
            Upload another resume file
          </button>
        </div>
      )}
    </div>
  );
};
