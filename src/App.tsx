import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sun,
  Plus,
  Trash2,
  RotateCcw,
  GraduationCap,
  BookOpen,
  ArrowLeftRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Download
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import AmbientBackground from './components/AmbientBackground';

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface CalculatorState {
  obtainedMarks: string;
  totalMarks: string;
  cgpaSubjects: Subject[];
  sgpaSubjects: Subject[];
  converterMode: 'cgpa-to-percent' | 'percent-to-cgpa';
  converterValue: string;
  averageMarks: string[];
}

interface CalculationResult {
  percentage: { value: number; grade: string } | null;
  cgpa: number;
  sgpa: number;
  converter: number | null;
  average: number | null;
}

interface UniversityPreset {
  id: string;
  name: string;
  section: 'universities' | 'systems';
  gradePoints: Record<string, number>;
  percentageMultiplier: number;
  percentageOffset: number;
  percentageConstant: number;
}

const universityPresets: UniversityPreset[] = [
  { id: 'bit-sindri', name: 'BIT Sindri', section: 'universities', gradePoints: { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0.5, percentageConstant: 0 },
  { id: 'nit-jamshedpur', name: 'NIT Jamshedpur', section: 'universities', gradePoints: { 'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'delhi-university', name: 'Delhi University', section: 'universities', gradePoints: { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'bit-mesra', name: 'BIT Mesra', section: 'universities', gradePoints: { 'O': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'mumbai-university', name: 'Mumbai University', section: 'universities', gradePoints: { 'O': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'P': 4, 'F': 0 }, percentageMultiplier: 7.1, percentageOffset: 0, percentageConstant: 11 },
  { id: 'bits-pilani', name: 'BITS Pilani', section: 'universities', gradePoints: { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'anna-university', name: 'Anna University', section: 'universities', gradePoints: { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'iit-nit-standard', name: 'IIT & NIT System', section: 'systems', gradePoints: { 'O': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'iiit-standard', name: 'IIIT System', section: 'systems', gradePoints: { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5, 'C': 4, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 },
  { id: 'jut-system', name: 'JUT System', section: 'systems', gradePoints: { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0.5, percentageConstant: 0 },
  { id: 'state-colleges-9.5', name: 'State University (Standard)', section: 'systems', gradePoints: { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5, 'C': 4, 'D': 3, 'F': 0 }, percentageMultiplier: 9.5, percentageOffset: 0, percentageConstant: 0 },
  { id: 'state-colleges-10', name: 'National Education Policy (NEP)', section: 'systems', gradePoints: { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5, 'C': 4, 'D': 3, 'F': 0 }, percentageMultiplier: 10, percentageOffset: 0, percentageConstant: 0 }
];

const defaultCalculatorState: CalculatorState = {
  obtainedMarks: '',
  totalMarks: '',
  cgpaSubjects: [{ id: '1', name: '', credits: 0, grade: '' }],
  sgpaSubjects: [{ id: '1', name: '', credits: 0, grade: '' }],
  converterMode: 'cgpa-to-percent',
  converterValue: '',
  averageMarks: ['', '']
};

interface SettingsState {
  selectedUniversity: string;
}

const defaultSettingsState: SettingsState = {
  selectedUniversity: 'bit-sindri'
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${
      active 
        ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white' 
        : 'bg-white/40 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700/60 border border-gray-200/20 dark:border-gray-700/20'
    }`}
  >
    {icon}
    <span className="leading-none font-medium">{label}</span>
  </motion.button>
);

const allowNumericOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
    return;
  }
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
  if (!allowedKeys.includes(e.key)) e.preventDefault();
  if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) e.preventDefault();
};

const handleNumericPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData('text');
  let numericValue = pastedData.replace(/[^0-9.]/g, '');
  const currentValue = (e.target as HTMLInputElement).value;
  if (currentValue.includes('.')) numericValue = numericValue.replace(/\./g, '');
  else {
    const parts = numericValue.split('.');
    if (parts.length > 2) numericValue = parts[0] + '.' + parts.slice(1).join('');
  }
  const inputElement = e.target as HTMLInputElement;
  const start = inputElement.selectionStart || 0;
  const end = inputElement.selectionEnd || 0;
  const newValue = currentValue.substring(0, start) + numericValue + currentValue.substring(end);
  if (/^\d*\.?\d*$/.test(newValue)) {
    inputElement.value = newValue;
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);
  }
};

const NotchedInput: React.FC<{ 
  label: string; 
  value: string | number; 
  onChange: (value: string) => void; 
  type?: string; 
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  min?: string | number;
  className?: string;
  containerClassName?: string;
}> = ({ label, value, onChange, type = "text", inputMode, onKeyDown, onInput, onPaste, min, className = "", containerClassName = "" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || (value !== '' && value !== undefined && value !== null);
  return (
    <div className={`floating-input relative h-14 flex items-center ${isActive ? 'active' : ''} ${containerClassName}`}>
      <input type={type} inputMode={inputMode} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown} onInput={onInput} onPaste={onPaste} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} min={min} placeholder=" " className={`w-full h-full px-4 pt-0 pb-0 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-transparent focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 ease-out text-base leading-none caret-indigo-600 dark:caret-indigo-400 backdrop-blur-sm ${className}`} />
      <label className={`floating-label ${isActive ? 'up' : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'}`}>{label}</label>
    </div>
  );
};

const InputField: React.FC<{ label: string; value: number | string; onChange: (value: string) => void; placeholder?: string; type?: string; min?: number }> = ({ label, value, onChange, type = 'number', min = 0 }) => {
  return (
    <NotchedInput label={label} value={value} onChange={onChange} type={type} inputMode={type === 'number' ? 'decimal' : 'text'} onKeyDown={type === 'number' ? allowNumericOnly : undefined} onInput={(e) => { if (type === 'number') { const input = e.currentTarget; const scrubbedValue = input.value.replace(/[^0-9.]/g, ''); if (scrubbedValue !== input.value) input.value = scrubbedValue; } }} onPaste={type === 'number' ? handleNumericPaste : undefined} min={min} />
  );
};

const PercentageCalculator: React.FC<{ state: { obtainedMarks: string; totalMarks: string }; setState: (state: { obtainedMarks: string; totalMarks: string }) => void; result: { value: number; grade: string } | null; universityName: string; formula: string }> = ({ state, setState, result, universityName, formula }) => {
  const reset = () => setState({ obtainedMarks: '', totalMarks: '' });
  return (
    <div className="space-y-4">
      <div className="text-center -mt-1"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Percentage Calculator</h2></div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Obtained Marks" value={state.obtainedMarks} onChange={(v) => setState({ ...state, obtainedMarks: v })} />
        <InputField label="Total Marks" value={state.totalMarks} onChange={(v) => setState({ ...state, totalMarks: v })} />
      </div>
      <AnimatePresence>
        {result ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mesh-gradient rounded-xl p-3 text-white">
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="text-center space-y-0.5"><div className="text-xs opacity-70 tracking-[2px] uppercase font-semibold">PERCENTAGE</div><div className="text-3xl font-bold tracking-tight text-white">{result.value.toFixed(2)}%</div><div className="text-xs opacity-80 font-medium">Grade: {result.grade}</div></div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(`${result.value.toFixed(2)}%`)} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Copy className="w-3 h-3" /> Copy</button>
                <button onClick={() => {
                  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
                  const content = `<!DOCTYPE html><html><head><title>ScoreSync - Percentage Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');body { font-family: 'Inter', sans-serif; padding: 20mm; background: #fdfdfd; color: #1F2937; line-height: 1.5; margin: 0; }.header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }.logo-container { position: relative; margin-bottom: 15px; }.logo { width: 64px; height: 64px; background: #6366F1; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4); position: relative; z-index: 1; }.logo-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #6366F1; filter: blur(20px); opacity: 0.3; z-index: 0; }h1 { font-size: 28px; font-weight: 700; color: #1F2937; margin: 0; letter-spacing: -0.5px; }.tagline { font-size: 10px; font-weight: 600; color: #6366F1; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; opacity: 0.8; }.report-card { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #F3F4F6; max-width: 800px; margin: 0 auto; }.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px; border-bottom: 1px solid #F3F4F6; padding-bottom: 25px; }.info-item .label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }.info-item .value { font-size: 15px; font-weight: 500; color: #1F2937; }.inputs-highlight { background: #F9FAFB; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #F3F4F6; }.input-row { display: flex; justify-content: space-between; margin-bottom: 12px; }.input-row:last-child { margin-bottom: 0; }.input-label { color: #6B7280; font-size: 14px; font-weight: 500; }.input-value { color: #111827; font-weight: 600; font-size: 16px; }.hero-result { background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%); border-radius: 20px; padding: 45px; text-align: center; color: white; margin-top: 40px; box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2); position: relative; overflow: hidden; }.result-label { font-size: 13px; font-weight: 600; opacity: 0.9; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 15px; }.result-value { font-size: 68px; font-weight: 800; margin: 0; line-height: 1; letter-spacing: -2px; }.grade-badge { display: inline-block; margin-top: 25px; padding: 10px 24px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 99px; font-size: 15px; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.2); }.footer { margin-top: 60px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 30px; }.footer-text { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }.footer-brand { font-size: 13px; color: #6B7280; font-weight: 500; }</style></head><body><div class="header"><div class="logo-container"><div class="logo-glow"></div><div class="logo">✓</div></div><h1>ScoreSync</h1><p class="tagline">SYNC • CALCULATE • ACHIEVE</p></div><div class="report-card"><div class="info-grid"><div class="info-item"><p class="label">Grading System</p><p class="value">${universityName}</p></div><div class="info-item"><p class="label">Calculation Type</p><p class="value">Percentage Assessment</p></div></div><div class="inputs-highlight"><div class="input-row"><span class="input-label">Obtained Marks</span><span class="input-value">${state.obtainedMarks}</span></div><div class="input-row"><span class="input-label">Total Marks</span><span class="input-value">${state.totalMarks}</span></div><div class="input-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #E5E7EB;"><span class="input-label">Applied Formula</span><span class="input-value" style="font-family: monospace; font-size: 13px;">${formula}</span></div></div><div class="hero-result"><p class="result-label">FINAL PERCENTAGE</p><p class="result-value">${result.value.toFixed(2)}%</p><p class="grade-badge">Grade: ${result.grade}</p></div></div><div class="footer"><p class="footer-text">Generated on ${date}</p><p class="footer-brand">Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design</p></div></body></html>`;
                  const blob = new Blob([content], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ScoreSync_Percentage_${Date.now()}.html`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Download className="w-3 h-3" /> PDF</button>
              </div>
            </div>
          </motion.div>
        ) : <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center text-gray-500 dark:text-gray-400 text-sm">Enter marks to see your result</div>}
      </AnimatePresence>
      <button onClick={reset} className="w-full py-2.5 bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg font-medium border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm group"><RotateCcw className="w-4 h-4 group-hover:rotate-[360deg] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" /> Reset</button>
    </div>
  );
};

const CGPACalculator: React.FC<{ subjects: Subject[]; setSubjects: (subjects: Subject[]) => void; cgpa: number; gradePoints: Record<string, number>; universityName: string; formula: string }> = ({ subjects, setSubjects, cgpa, gradePoints, universityName, formula }) => {
  const addSubject = () => setSubjects([...subjects, { id: Date.now().toString(), name: '', credits: 0, grade: '' }]);
  const updateSubject = (id: string, field: keyof Subject, value: string | number) => setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  const deleteSubject = (id: string) => { if (subjects.length > 1) setSubjects(subjects.filter(s => s.id !== id)); };
  const reset = () => setSubjects([{ id: '1', name: '', credits: 0, grade: '' }]);
  return (
    <div className="space-y-4">
      <div className="text-center -mt-1"><h2 className="text-lg font-bold text-gray-900 dark:text-white">CGPA Calculator</h2></div>
      <div className="space-y-3">
        {subjects.map((subject) => (
          <motion.div key={subject.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="grid grid-cols-3 gap-3">
              <NotchedInput label="Subject" value={subject.name} onChange={(v) => updateSubject(subject.id, 'name', v)} className="!rounded-lg !px-3" />
              <NotchedInput label="Credits" value={subject.credits || ''} onChange={(v) => updateSubject(subject.id, 'credits', parseInt(v) || 0)} type="number" inputMode="numeric" onKeyDown={allowNumericOnly} onInput={(e) => { const input = e.currentTarget; const scrubbedValue = input.value.replace(/[^0-9]/g, ''); if (scrubbedValue !== input.value) input.value = scrubbedValue; }} onPaste={handleNumericPaste} min="0" className="!rounded-lg !px-3" />
              <div className="flex gap-2">
                <select value={subject.grade} onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)} className="flex-1 px-3 py-2.5 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm border border-indigo-200/50 dark:border-indigo-700/50 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 backdrop-blur-sm"><option value="" disabled>Select Grade</option>{Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}</select>
                {subjects.length > 1 && <button onClick={() => deleteSubject(subject.id)} className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addSubject} className="flex-1 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> Add Subject</button>
        <button onClick={reset} className="flex-1 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs group"><RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[360deg] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" /> Reset</button>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, boxShadow: cgpa > 0 ? '0 0 25px rgba(99, 102, 241, 0.3), 0 0 50px rgba(99, 102, 241, 0.15)' : '0 0 0px rgba(99, 102, 241, 0)' }} transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }} className="mesh-gradient rounded-xl p-3 text-white">
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="text-center space-y-0.5"><div className="text-xs opacity-70 tracking-[2px] uppercase font-semibold">CGPA</div><div className="text-3xl font-bold tracking-tight text-white">{cgpa.toFixed(2)}</div><div className="text-xs opacity-80 font-medium">{cgpa > 0 ? (cgpa >= 9 ? '🌟 Outstanding!' : cgpa >= 8 ? 'Excellent!' : cgpa >= 7 ? 'Very Good!' : cgpa >= 6 ? 'Good!' : 'Keep Improving!') : 'Enter subject details'}</div></div>
          {cgpa > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(cgpa.toFixed(2))} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Copy className="w-3 h-3" /> Copy</button>
              <button onClick={() => {
                const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
                const content = `<!DOCTYPE html><html><head><title>ScoreSync - CGPA Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');body { font-family: 'Inter', sans-serif; padding: 20mm; background: #fdfdfd; color: #1F2937; line-height: 1.5; margin: 0; }.header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }.logo-container { position: relative; margin-bottom: 15px; }.logo { width: 64px; height: 64px; background: #6366F1; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4); position: relative; z-index: 1; }.logo-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #6366F1; filter: blur(20px); opacity: 0.3; z-index: 0; }h1 { font-size: 28px; font-weight: 700; color: #1F2937; margin: 0; letter-spacing: -0.5px; }.tagline { font-size: 10px; font-weight: 600; color: #6366F1; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; opacity: 0.8; }.report-card { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #F3F4F6; max-width: 800px; margin: 0 auto; }.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px; border-bottom: 1px solid #F3F4F6; padding-bottom: 25px; }.info-item .label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }.info-item .value { font-size: 15px; font-weight: 500; color: #1F2937; }.data-table { width: 100%; border-collapse: collapse; margin: 30px 0; }.data-table th { text-align: left; padding: 12px 15px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F3F4F6; }.data-table td { padding: 15px; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6; }.data-table tr:last-child td { border-bottom: none; }.hero-result { background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%); border-radius: 20px; padding: 45px; text-align: center; color: white; margin-top: 40px; box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2); position: relative; overflow: hidden; }.result-label { font-size: 13px; font-weight: 600; opacity: 0.9; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 15px; }.result-value { font-size: 68px; font-weight: 800; margin: 0; line-height: 1; letter-spacing: -2px; }.footer { margin-top: 60px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 30px; }.footer-text { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }.footer-brand { font-size: 13px; color: #6B7280; font-weight: 500; }</style></head><body><div class="header"><div class="logo-container"><div class="logo-glow"></div><div class="logo">✓</div></div><h1>ScoreSync</h1><p class="tagline">SYNC • CALCULATE • ACHIEVE</p></div><div class="report-card"><div class="info-grid"><div class="info-item"><p class="label">Grading System</p><p class="value">${universityName}</p></div><div class="info-item"><p class="label">Calculation Type</p><p class="value">CGPA Assessment</p></div></div><table class="data-table"><thead><tr><th>Subject</th><th>Credits</th><th>Grade</th></tr></thead><tbody>${subjects.filter(s => s.name || s.credits > 0 || s.grade).map(s => `<tr><td style="font-weight: 500; color: #111827;">${s.name || 'Untitled Subject'}</td><td>${s.credits > 0 ? s.credits : '—'}</td><td><span style="font-weight: 600; color: #6366F1;">${s.grade || '—'}</span></td></tr>`).join('')}</tbody></table><div class="hero-result"><p class="result-label">CUMULATIVE GPA</p><p class="result-value">${cgpa.toFixed(2)}</p><div style="margin-top: 15px; font-size: 13px; opacity: 0.8; font-family: monospace;">Formula: ${formula}</div></div></div><div class="footer"><p class="footer-text">Generated on ${date}</p><p class="footer-brand">Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design</p></div></body></html>`;
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ScoreSync_CGPA_${Date.now()}.html`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Download className="w-3 h-3" /> PDF</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const SGPACalculator: React.FC<{ subjects: Subject[]; setSubjects: (subjects: Subject[]) => void; sgpa: number; gradePoints: Record<string, number>; universityName: string; formula: string }> = ({ subjects, setSubjects, sgpa, gradePoints, universityName, formula }) => {
  const addSubject = () => setSubjects([...subjects, { id: Date.now().toString(), name: '', credits: 0, grade: '' }]);
  const updateSubject = (id: string, field: keyof Subject, value: string | number) => setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  const deleteSubject = (id: string) => { if (subjects.length > 1) setSubjects(subjects.filter(s => s.id !== id)); };
  const reset = () => setSubjects([{ id: '1', name: '', credits: 0, grade: '' }]);
  return (
    <div className="space-y-4">
      <div className="text-center -mt-1"><h2 className="text-lg font-bold text-gray-900 dark:text-white">SGPA Calculator</h2></div>
      <div className="space-y-3">
        {subjects.map((subject) => (
          <motion.div key={subject.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="grid grid-cols-3 gap-3">
              <NotchedInput label="Subject" value={subject.name} onChange={(v) => updateSubject(subject.id, 'name', v)} className="!rounded-lg !px-3" />
              <NotchedInput label="Credits" value={subject.credits || ''} onChange={(v) => updateSubject(subject.id, 'credits', parseInt(v) || 0)} type="number" inputMode="numeric" onKeyDown={allowNumericOnly} onInput={(e) => { const input = e.currentTarget; const scrubbedValue = input.value.replace(/[^0-9]/g, ''); if (scrubbedValue !== input.value) input.value = scrubbedValue; }} onPaste={handleNumericPaste} min="0" className="!rounded-lg !px-3" />
              <div className="flex gap-2">
                <select value={subject.grade} onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)} className="flex-1 px-3 py-2.5 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm border border-indigo-200/50 dark:border-indigo-700/50 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 backdrop-blur-sm"><option value="" disabled>Select Grade</option>{Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}</select>
                {subjects.length > 1 && <button onClick={() => deleteSubject(subject.id)} className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addSubject} className="flex-1 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> Add Subject</button>
        <button onClick={reset} className="flex-1 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs group"><RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[360deg] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" /> Reset</button>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, boxShadow: sgpa > 0 ? '0 0 25px rgba(34, 197, 94, 0.3), 0 0 50px rgba(34, 197, 94, 0.15)' : '0 0 0px rgba(34, 197, 94, 0)' }} transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 text-white">
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="text-center space-y-0.5"><div className="text-xs opacity-70 tracking-[2px] uppercase font-semibold">SGPA</div><div className="text-3xl font-bold tracking-tight text-white">{sgpa.toFixed(2)}</div><div className="text-xs opacity-80 font-medium">{sgpa > 0 ? (sgpa >= 9 ? '🌟 Outstanding!' : sgpa >= 8 ? 'Excellent!' : sgpa >= 7 ? 'Very Good!' : sgpa >= 6 ? 'Good!' : 'Keep Improving!') : 'Enter subject details'}</div></div>
          {sgpa > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(sgpa.toFixed(2))} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Copy className="w-3 h-3" /> Copy</button>
              <button onClick={() => {
                const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
                const content = `<!DOCTYPE html><html><head><title>ScoreSync - SGPA Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');body { font-family: 'Inter', sans-serif; padding: 20mm; background: #fdfdfd; color: #1F2937; line-height: 1.5; margin: 0; }.header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }.logo-container { position: relative; margin-bottom: 15px; }.logo { width: 64px; height: 64px; background: #10B981; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); position: relative; z-index: 1; }.logo-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #10B981; filter: blur(20px); opacity: 0.3; z-index: 0; }h1 { font-size: 28px; font-weight: 700; color: #1F2937; margin: 0; letter-spacing: -0.5px; }.tagline { font-size: 10px; font-weight: 600; color: #059669; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; opacity: 0.8; }.report-card { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #F3F4F6; max-width: 800px; margin: 0 auto; }.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px; border-bottom: 1px solid #F3F4F6; padding-bottom: 25px; }.info-item .label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }.info-item .value { font-size: 15px; font-weight: 500; color: #1F2937; }.data-table { width: 100%; border-collapse: collapse; margin: 30px 0; }.data-table th { text-align: left; padding: 12px 15px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F3F4F6; }.data-table td { padding: 15px; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6; }.data-table tr:last-child td { border-bottom: none; }.hero-result { background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 20px; padding: 45px; text-align: center; color: white; margin-top: 40px; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.2); position: relative; overflow: hidden; }.result-label { font-size: 13px; font-weight: 600; opacity: 0.9; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 15px; }.result-value { font-size: 68px; font-weight: 800; margin: 0; line-height: 1; letter-spacing: -2px; }.footer { margin-top: 60px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 30px; }.footer-text { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }.footer-brand { font-size: 13px; color: #6B7280; font-weight: 500; }</style></head><body><div class="header"><div class="logo-container"><div class="logo-glow"></div><div class="logo">✓</div></div><h1>ScoreSync</h1><p class="tagline">SYNC • CALCULATE • ACHIEVE</p></div><div class="report-card"><div class="info-grid"><div class="info-item"><p class="label">Grading System</p><p class="value">${universityName}</p></div><div class="info-item"><p class="label">Calculation Type</p><p class="value">SGPA Assessment</p></div></div><table class="data-table"><thead><tr><th>Subject</th><th>Credits</th><th>Grade</th></tr></thead><tbody>${subjects.filter(s => s.name || s.credits > 0 || s.grade).map(s => `<tr><td style="font-weight: 500; color: #111827;">${s.name || 'Untitled Subject'}</td><td>${s.credits > 0 ? s.credits : '—'}</td><td><span style="font-weight: 600; color: #10B981;">${s.grade || '—'}</span></td></tr>`).join('')}</tbody></table><div class="hero-result"><p class="result-label">SEMESTER GPA</p><p class="result-value">${sgpa.toFixed(2)}</p><div style="margin-top: 15px; font-size: 13px; opacity: 0.8; font-family: monospace;">Formula: ${formula}</div></div></div><div class="footer"><p class="footer-text">Generated on ${date}</p><p class="footer-brand">Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design</p></div></body></html>`;
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ScoreSync_SGPA_${Date.now()}.html`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Download className="w-3 h-3" /> PDF</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Converter: React.FC<{ mode: 'cgpa-to-percent' | 'percent-to-cgpa'; setMode: (mode: 'cgpa-to-percent' | 'percent-to-cgpa') => void; value: string; setValue: (value: string) => void; result: number | null; universityName: string; formula: string }> = ({ mode, setMode, value, setValue, result, universityName, formula }) => {
  const reset = () => { setValue(''); };
  const handleModeSwitch = (newMode: 'cgpa-to-percent' | 'percent-to-cgpa') => { if (result !== null) setValue(result.toFixed(2)); setMode(newMode); };
  return (
    <div className="space-y-4">
      <div className="text-center -mt-1"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Grade Converter</h2></div>
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <button onClick={() => handleModeSwitch('cgpa-to-percent')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === 'cgpa-to-percent' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>CGPA → Percentage</button>
        <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1 self-center"></div>
        <button onClick={() => handleModeSwitch('percent-to-cgpa')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${mode === 'percent-to-cgpa' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Percentage → CGPA</button>
      </div>
      <div className="relative h-14"><AnimatePresence mode="wait"><motion.div key={mode} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }} className="absolute inset-0"><InputField label={mode === 'cgpa-to-percent' ? 'Enter CGPA' : 'Enter Percentage'} value={value} onChange={setValue} type="number" min={0} /></motion.div></AnimatePresence></div>
      <AnimatePresence mode="wait">
        {result !== null ? (
          <motion.div key={mode} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1, boxShadow: '0 0 25px rgba(99, 102, 241, 0.3), 0 0 50px rgba(99, 102, 241, 0.15)' }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }} className="mesh-gradient rounded-xl p-3 text-white">
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="text-center space-y-0.5"><div className="text-xs opacity-70 tracking-[2px] uppercase font-semibold">{mode === 'cgpa-to-percent' ? 'PERCENTAGE' : 'CGPA'}</div><div className="text-3xl font-bold tracking-tight text-white">{result.toFixed(2)}{mode === 'cgpa-to-percent' ? '%' : ''}</div></div>
              <div className="flex items-center gap-2">
                <button onClick={() => { navigator.clipboard.writeText(mode === 'cgpa-to-percent' ? `${result.toFixed(2)}%` : result.toFixed(2)); }} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Copy className="w-3 h-3" /> Copy</button>
                <button onClick={() => {
                  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
                  const content = `<!DOCTYPE html><html><head><title>ScoreSync - Conversion Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');body { font-family: 'Inter', sans-serif; padding: 20mm; background: #fdfdfd; color: #1F2937; line-height: 1.5; margin: 0; }.header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }.logo-container { position: relative; margin-bottom: 15px; }.logo { width: 64px; height: 64px; background: #6366F1; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4); position: relative; z-index: 1; }.logo-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #6366F1; filter: blur(20px); opacity: 0.3; z-index: 0; }h1 { font-size: 28px; font-weight: 700; color: #1F2937; margin: 0; letter-spacing: -0.5px; }.tagline { font-size: 10px; font-weight: 600; color: #6366F1; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; opacity: 0.8; }.report-card { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #F3F4F6; max-width: 800px; margin: 0 auto; }.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px; border-bottom: 1px solid #F3F4F6; padding-bottom: 25px; }.info-item .label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }.info-item .value { font-size: 15px; font-weight: 500; color: #1F2937; }.inputs-highlight { background: #F9FAFB; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #F3F4F6; }.input-row { display: flex; justify-content: space-between; margin-bottom: 12px; }.input-row:last-child { margin-bottom: 0; }.input-label { color: #6B7280; font-size: 14px; font-weight: 500; }.input-value { color: #111827; font-weight: 600; font-size: 16px; }.hero-result { background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%); border-radius: 20px; padding: 45px; text-align: center; color: white; margin-top: 40px; box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2); position: relative; overflow: hidden; }.result-label { font-size: 13px; font-weight: 600; opacity: 0.9; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 15px; }.result-value { font-size: 68px; font-weight: 800; margin: 0; line-height: 1; letter-spacing: -2px; }.footer { margin-top: 60px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 30px; }.footer-text { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }.footer-brand { font-size: 13px; color: #6B7280; font-weight: 500; }</style></head><body><div class="header"><div class="logo-container"><div class="logo-glow"></div><div class="logo">✓</div></div><h1>ScoreSync</h1><p class="tagline">SYNC • CALCULATE • ACHIEVE</p></div><div class="report-card"><div class="info-grid"><div class="info-item"><p class="label">Grading System</p><p class="value">${universityName}</p></div><div class="info-item"><p class="label">Calculation Type</p><p class="value">Grade Conversion</p></div></div><div class="inputs-highlight"><div class="input-row"><span class="input-label">${mode === 'cgpa-to-percent' ? 'Input CGPA' : 'Input Percentage'}</span><span class="input-value">${value}${mode === 'cgpa-to-percent' ? '' : '%'}</span></div><div class="input-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #E5E7EB;"><span class="input-label">Applied Formula</span><span class="input-value" style="font-family: monospace; font-size: 13px;">${formula}</span></div></div><div class="hero-result"><p class="result-label">${mode === 'cgpa-to-percent' ? 'CONVERTED PERCENTAGE' : 'CONVERTED CGPA'}</p><p class="result-value">${result.toFixed(2)}${mode === 'cgpa-to-percent' ? '%' : ''}</p></div></div><div class="footer"><p class="footer-text">Generated on ${date}</p><p class="footer-brand">Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design</p></div></body></html>`;
                  const blob = new Blob([content], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ScoreSync_Conversion_${Date.now()}.html`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Download className="w-3 h-3" /> PDF</button>
              </div>
            </div>
          </motion.div>
        ) : <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center text-gray-500 dark:text-gray-400 text-sm">Enter a value to convert</motion.div>}
      </AnimatePresence>
      <button onClick={() => setValue('')} className="w-full py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm group"><RotateCcw className="w-4 h-4 group-hover:rotate-[360deg] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" /> Reset</button>
    </div>
  );
};

const AverageCalculator: React.FC<{ marks: string[]; setMarks: (marks: string[]) => void; average: number | null; universityName: string }> = ({ marks, setMarks, average, universityName }) => {
  const updateMark = (index: number, value: string) => { const newMarks = [...marks]; newMarks[index] = value; setMarks(newMarks); };
  const addMarkField = () => setMarks([...marks, '']);
  const reset = () => { setMarks(['', '']); };
  return (
    <div className="space-y-4">
      <div className="text-center -mt-1"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Average Calculator</h2></div>
      <div className="space-y-3">
        {marks.map((mark, index) => (
          <div key={index} className="relative flex items-center">
            <NotchedInput label={`Semester ${index + 1}`} value={mark} onChange={(v) => updateMark(index, v)} type="number" inputMode="decimal" onKeyDown={allowNumericOnly} onInput={(e) => { const input = e.currentTarget; const scrubbedValue = input.value.replace(/[^0-9.]/g, ''); if (scrubbedValue !== input.value) input.value = scrubbedValue; }} onPaste={handleNumericPaste} containerClassName="flex-1" />
            <button onClick={() => { if (marks.length > 2) setMarks(marks.filter((_, i) => i !== index)); }} disabled={marks.length <= 2} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all z-10 ${marks.length <= 2 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'}`}><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addMarkField} className="flex-1 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> Add Semester</button>
        <button onClick={reset} className="flex-1 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs group"><RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[360deg] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" /> Reset</button>
      </div>
      <AnimatePresence>
        {average !== null ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1, boxShadow: '0 0 25px rgba(99, 102, 241, 0.3), 0 0 50px rgba(99, 102, 241, 0.15)' }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }} className="mesh-gradient rounded-xl p-3 text-white">
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="text-center space-y-0.5"><div className="text-xs opacity-70 tracking-[2px] uppercase font-semibold">AVERAGE</div><div className="text-3xl font-bold tracking-tight text-white">{average.toFixed(2)}</div></div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(average.toFixed(2))} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Copy className="w-3 h-3" /> Copy</button>
                <button onClick={() => {
                  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
                  const content = `<!DOCTYPE html><html><head><title>ScoreSync - Average Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');body { font-family: 'Inter', sans-serif; padding: 20mm; background: #fdfdfd; color: #1F2937; line-height: 1.5; margin: 0; }.header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }.logo-container { position: relative; margin-bottom: 15px; }.logo { width: 64px; height: 64px; background: #6366F1; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4); position: relative; z-index: 1; }.logo-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #6366F1; filter: blur(20px); opacity: 0.3; z-index: 0; }h1 { font-size: 28px; font-weight: 700; color: #1F2937; margin: 0; letter-spacing: -0.5px; }.tagline { font-size: 10px; font-weight: 600; color: #6366F1; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px; opacity: 0.8; }.report-card { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #F3F4F6; max-width: 800px; margin: 0 auto; }.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px; border-bottom: 1px solid #F3F4F6; padding-bottom: 25px; }.info-item .label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }.info-item .value { font-size: 15px; font-weight: 500; color: #1F2937; }.data-table { width: 100%; border-collapse: collapse; margin: 30px 0; }.data-table th { text-align: left; padding: 12px 15px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #F3F4F6; }.data-table td { padding: 15px; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6; }.data-table tr:last-child td { border-bottom: none; }.hero-result { background: linear-gradient(135deg, #6366F1 0%, #4338CA 100%); border-radius: 20px; padding: 45px; text-align: center; color: white; margin-top: 40px; box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2); position: relative; overflow: hidden; }.result-label { font-size: 13px; font-weight: 600; opacity: 0.9; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 15px; }.result-value { font-size: 68px; font-weight: 800; margin: 0; line-height: 1; letter-spacing: -2px; }.footer { margin-top: 60px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 30px; }.footer-text { font-size: 12px; color: #9CA3AF; margin-bottom: 10px; }.footer-brand { font-size: 13px; color: #6B7280; font-weight: 500; }</style></head><body><div class="header"><div class="logo-container"><div class="logo-glow"></div><div class="logo">✓</div></div><h1>ScoreSync</h1><p class="tagline">SYNC • CALCULATE • ACHIEVE</p></div><div class="report-card"><div class="info-grid"><div class="info-item"><p class="label">Grading System</p><p class="value">${universityName}</p></div><div class="info-item"><p class="label">Calculation Type</p><p class="value">Average Assessment</p></div></div><table class="data-table"><thead><tr><th>Semester</th><th>Result</th></tr></thead><tbody>${marks.filter(m => m).map((m, i) => `<tr><td style="font-weight: 500; color: #111827;">Semester ${i + 1}</td><td><span style="font-weight: 600; color: #6366F1;">${m}</span></td></tr>`).join('')}</tbody></table><div class="hero-result"><p class="result-label">FINAL AVERAGE</p><p class="result-value">${average.toFixed(2)}</p></div></div><div class="footer"><p class="footer-text">Generated on ${date}</p><p class="footer-brand">Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design</p></div></body></html>`;
                  const blob = new Blob([content], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ScoreSync_Average_${Date.now()}.html`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }} className="px-3 py-1.5 glass-button rounded-lg flex items-center gap-1.5 text-xs font-medium"><Download className="w-3 h-3" /> PDF</button>
              </div>
            </div>
          </motion.div>
        ) : <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center text-gray-500 dark:text-gray-400 text-sm">Enter semester results to calculate average</div>}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'percentage' | 'cgpa' | 'sgpa' | 'converter' | 'average'>('percentage');
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  
  const [calculatorState, setCalculatorState] = useState<CalculatorState>(defaultCalculatorState);
  const [settings, setSettings] = useState<SettingsState>(defaultSettingsState);
  const [results, setResults] = useState<CalculationResult>({ percentage: null, cgpa: 0, sgpa: 0, converter: null, average: null });

  const currentPreset = universityPresets.find(p => p.id === settings.selectedUniversity) || universityPresets[0];
  
  const currentGradePoints = currentPreset.gradePoints;
  const currentPercentageMultiplier = currentPreset.percentageMultiplier;
  const currentPercentageOffset = currentPreset.percentageOffset;
  const currentPercentageConstant = currentPreset.percentageConstant;

  const getFormulaDisplay = () => {
    if (currentPercentageConstant > 0) return `Percentage = (CGPA × ${currentPercentageMultiplier}) + ${currentPercentageConstant}`;
    else if (currentPercentageOffset > 0) return `Percentage = (CGPA - ${currentPercentageOffset}) × ${currentPercentageMultiplier}`;
    else return `Percentage = CGPA × ${currentPercentageMultiplier}`;
  };

  const getUniversityLabel = () => {
    const preset = universityPresets.find(p => p.id === settings.selectedUniversity);
    if (!preset) return 'Grading System';
    const labelMap: Record<string, string> = { 'bit-sindri': 'BIT Sindri', 'nit-jamshedpur': 'NIT Jamshedpur', 'delhi-university': 'Delhi University', 'bit-mesra': 'BIT Mesra', 'mumbai-university': 'Mumbai University', 'bits-pilani': 'BITS Pilani', 'anna-university': 'Anna University', 'iit-nit-standard': 'IIT & NIT', 'iiit-standard': 'IIIT', 'jut-system': 'JUT', 'state-colleges-9.5': 'State University', 'state-colleges-10': 'NEP' };
    return labelMap[preset.id] || preset.name;
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    try {
      const savedState = sessionStorage.getItem('gradeFlowCalculatorState');
      if (savedState) setCalculatorState(JSON.parse(savedState));
      const savedSettings = sessionStorage.getItem('gradeFlowSettings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) { console.error('Failed to load state:', e); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem('gradeFlowCalculatorState', JSON.stringify(calculatorState));
      sessionStorage.setItem('gradeFlowSettings', JSON.stringify(settings));
    } catch (e) { console.error('Failed to save state:', e); }
  }, [calculatorState, settings, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode, loaded]);

  useEffect(() => {
    const { obtainedMarks, totalMarks } = calculatorState;
    const obtained = parseFloat(obtainedMarks), total = parseFloat(totalMarks);
    if (obtained >= 0 && total > 0 && obtained <= total) {
      const percentage = (obtained / total) * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'O'; else if (percentage >= 80) grade = 'A+'; else if (percentage >= 70) grade = 'A'; else if (percentage >= 60) grade = 'B+'; else if (percentage >= 50) grade = 'B'; else if (percentage >= 40) grade = 'C'; else if (percentage >= 30) grade = 'D';
      setResults(prev => ({ ...prev, percentage: { value: percentage, grade } }));
    } else setResults(prev => ({ ...prev, percentage: null }));
  }, [calculatorState.obtainedMarks, calculatorState.totalMarks]);

  useEffect(() => {
    let totalPoints = 0, totalCredits = 0, hasValidData = false;
    calculatorState.cgpaSubjects.forEach(s => { if (s.credits > 0 && s.grade) { totalPoints += (currentGradePoints[s.grade] || 0) * s.credits; totalCredits += s.credits; hasValidData = true; } });
    setResults(prev => ({ ...prev, cgpa: hasValidData && totalCredits > 0 ? totalPoints / totalCredits : 0 }));
  }, [calculatorState.cgpaSubjects, currentGradePoints]);

  useEffect(() => {
    let totalPoints = 0, totalCredits = 0, hasValidData = false;
    calculatorState.sgpaSubjects.forEach(s => { if (s.credits > 0 && s.grade) { totalPoints += (currentGradePoints[s.grade] || 0) * s.credits; totalCredits += s.credits; hasValidData = true; } });
    setResults(prev => ({ ...prev, sgpa: hasValidData && totalCredits > 0 ? totalPoints / totalCredits : 0 }));
  }, [calculatorState.sgpaSubjects, currentGradePoints]);

  useEffect(() => {
    const value = parseFloat(calculatorState.converterValue);
    if (!isNaN(value) && value >= 0) {
      let converted: number;
      if (calculatorState.converterMode === 'cgpa-to-percent') {
        if (currentPercentageConstant > 0) converted = Math.max(0, Math.min(100, (value * currentPercentageMultiplier) + currentPercentageConstant));
        else if (currentPercentageOffset > 0) converted = Math.max(0, Math.min(100, (value - currentPercentageOffset) * currentPercentageMultiplier));
        else converted = Math.max(0, Math.min(100, value * currentPercentageMultiplier));
      } else {
        if (currentPercentageConstant > 0) converted = Math.max(0, Math.min(10, (value - currentPercentageConstant) / currentPercentageMultiplier));
        else if (currentPercentageOffset > 0) converted = Math.max(0, Math.min(10, (value / currentPercentageMultiplier) + currentPercentageOffset));
        else converted = Math.max(0, Math.min(10, value / currentPercentageMultiplier));
      }
      setResults(prev => ({ ...prev, converter: converted }));
    } else setResults(prev => ({ ...prev, converter: null }));
  }, [calculatorState.converterValue, calculatorState.converterMode, currentPercentageMultiplier, currentPercentageOffset, currentPercentageConstant]);

  useEffect(() => {
    const validMarks = calculatorState.averageMarks.map(m => parseFloat(m)).filter(m => !isNaN(m) && m >= 0);
    setResults(prev => ({ ...prev, average: validMarks.length > 0 ? validMarks.reduce((a, b) => a + b, 0) / validMarks.length : null }));
  }, [calculatorState.averageMarks]);

  const tabs = [
    { id: 'percentage' as const, icon: <CheckCircle2 className="w-4 h-4" />, label: 'Percentage' },
    { id: 'cgpa' as const, icon: <GraduationCap className="w-4 h-4" />, label: 'CGPA' },
    { id: 'sgpa' as const, icon: <BookOpen className="w-4 h-4" />, label: 'SGPA' },
    { id: 'converter' as const, icon: <ArrowLeftRight className="w-4 h-4" />, label: 'Converter' },
    { id: 'average' as const, icon: <BarChart3 className="w-4 h-4" />, label: 'Average' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'percentage': return <PercentageCalculator state={{ obtainedMarks: calculatorState.obtainedMarks, totalMarks: calculatorState.totalMarks }} setState={(s) => setCalculatorState(prev => ({ ...prev, ...s }))} result={results.percentage} universityName={currentPreset.name} formula={getFormulaDisplay()} />;
      case 'cgpa': return <CGPACalculator subjects={calculatorState.cgpaSubjects} setSubjects={(s) => setCalculatorState(prev => ({ ...prev, cgpaSubjects: s }))} cgpa={results.cgpa} gradePoints={currentGradePoints} universityName={currentPreset.name} formula={getFormulaDisplay()} />;
      case 'sgpa': return <SGPACalculator subjects={calculatorState.sgpaSubjects} setSubjects={(s) => setCalculatorState(prev => ({ ...prev, sgpaSubjects: s }))} sgpa={results.sgpa} gradePoints={currentGradePoints} universityName={currentPreset.name} formula={getFormulaDisplay()} />;
      case 'converter': return <Converter mode={calculatorState.converterMode} setMode={(m) => setCalculatorState(prev => ({ ...prev, converterMode: m }))} value={calculatorState.converterValue} setValue={(v) => setCalculatorState(prev => ({ ...prev, converterValue: v }))} result={results.converter} universityName={currentPreset.name} formula={getFormulaDisplay()} />;
      case 'average': return <AverageCalculator marks={calculatorState.averageMarks} setMarks={(m) => setCalculatorState(prev => ({ ...prev, averageMarks: m }))} average={results.average} universityName={currentPreset.name} />;
    }
  };

  if (!loaded) return (<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>);

  return (
    <>
      <AmbientBackground isSubdued={!showLanding} />
      <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}><LandingPage onEnter={() => setShowLanding(false)} darkMode={darkMode} /></motion.div>
      ) : (
        <motion.div key="app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
          <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <button onClick={() => setShowLanding(true)} className="flex items-center gap-3 group transition-all duration-300 hover:translate-y-[-1px] active:scale-95">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/30 group-hover:glow-icon flex-shrink-0 transition-all"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                  <div className="min-w-0 text-left"><h1 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">ScoreSync</h1><p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">SYNC • CALCULATE • ACHIEVE</p></div>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSettingsOpen(true)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">{getUniversityLabel()}</button>
                  <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center flex-shrink-0">{darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}</button>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-6">
            <div className="sticky top-[60px] z-40 glass-dock rounded-2xl mx-auto max-w-fit px-3 py-2.5 mb-3" style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <div className="flex justify-center gap-2 overflow-x-auto px-2">{tabs.map(tab => (<TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} label={tab.label} />))}</div>
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-floating border border-white/20 dark:border-gray-700/30"><AnimatePresence mode="wait">{renderContent()}</AnimatePresence></motion.div>
          </main>
          <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">ScoreSync © 2026 • Built by BITian • Privacy First</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">Built To Simplify Academic Progress Through Intelligent Tools And Modern Student-Focused Design</p>
            </div>
          </footer>
          <AnimatePresence>{settingsOpen && (<SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} setSettings={setSettings} />)}</AnimatePresence>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; settings: SettingsState; setSettings: (settings: SettingsState) => void }> = ({ isOpen, onClose, settings, setSettings }) => {
  const handleUniversitySelect = (universityId: string) => { setSettings({ selectedUniversity: universityId }); onClose(); };
  const universities = universityPresets.filter(p => p.section === 'universities'), systems = universityPresets.filter(p => p.section === 'systems');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"><h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Grading Systems</h2><button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><span className="text-2xl text-gray-500 dark:text-gray-400">×</span></button></div>
        <div className="p-6 space-y-6">
          <div><h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Universities</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{universities.map(p => (<button key={p.id} onClick={() => handleUniversitySelect(p.id)} className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${settings.selectedUniversity === p.id ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{p.name}</button>))}</div></div>
          <div><h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">General Systems</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{systems.map(p => (<button key={p.id} onClick={() => handleUniversitySelect(p.id)} className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${settings.selectedUniversity === p.id ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{p.name}</button>))}</div></div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
