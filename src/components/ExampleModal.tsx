import React, { useState, useEffect } from 'react';
import { X, Building2, Link as LinkIcon, Check } from 'lucide-react';
import { ExampleAsset, CaseType } from '../types';

interface ExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exampleData: Partial<ExampleAsset> & { assetName: string; caseTypeIds: string[] }) => void;
  initialData?: ExampleAsset | null;
  defaultCaseTypeId?: string;
  allCaseTypes: CaseType[];
}

export const ExampleModal: React.FC<ExampleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultCaseTypeId,
  allCaseTypes,
}) => {
  const [assetName, setAssetName] = useState('');
  const [gainAssetUrl, setGainAssetUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [tickerOrIdentifier, setTickerOrIdentifier] = useState('');
  const [transactionYear, setTransactionYear] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [selectedCaseTypeIds, setSelectedCaseTypeIds] = useState<string[]>([]);
  const [authorName, setAuthorName] = useState('Senior Database Analyst');
  const [errors, setErrors] = useState<{ assetName?: string; caseTypeIds?: string }>({});

  useEffect(() => {
    if (initialData) {
      setAssetName(initialData.assetName);
      setGainAssetUrl(initialData.gainAssetUrl);
      setNotes(initialData.notes);
      setTickerOrIdentifier(initialData.tickerOrIdentifier || '');
      setTransactionYear(initialData.transactionYear || '');
      setKeyTakeaway(initialData.keyTakeaway || '');
      setSelectedCaseTypeIds(initialData.caseTypeIds || []);
      setAuthorName(initialData.createdBy || 'Senior Database Analyst');
    } else {
      setAssetName('');
      setGainAssetUrl('');
      setNotes('');
      setTickerOrIdentifier('');
      setTransactionYear('');
      setKeyTakeaway('');
      setSelectedCaseTypeIds(defaultCaseTypeId ? [defaultCaseTypeId] : []);
      setAuthorName('Senior Database Analyst');
    }
    setErrors({});
  }, [initialData, defaultCaseTypeId, isOpen]);

  if (!isOpen) return null;

  const toggleCaseType = (id: string) => {
    if (selectedCaseTypeIds.includes(id)) {
      if (selectedCaseTypeIds.length === 1) {
        // Must have at least one case type
        return;
      }
      setSelectedCaseTypeIds(selectedCaseTypeIds.filter((cid) => cid !== id));
    } else {
      setSelectedCaseTypeIds([...selectedCaseTypeIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { assetName?: string; caseTypeIds?: string } = {};

    if (!assetName.trim()) {
      newErrors.assetName = 'Asset or company name is required';
    }
    if (selectedCaseTypeIds.length === 0) {
      newErrors.caseTypeIds = 'Select at least one case type for this asset';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData?.id,
      assetName: assetName.trim(),
      gainAssetUrl: gainAssetUrl.trim(),
      notes: notes.trim(),
      tickerOrIdentifier: tickerOrIdentifier.trim() || undefined,
      transactionYear: transactionYear.trim() || undefined,
      keyTakeaway: keyTakeaway.trim() || undefined,
      caseTypeIds: selectedCaseTypeIds,
      createdBy: authorName.trim() || 'Senior Database Analyst',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] z-10 animate-scale-in transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850/60 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {initialData ? 'Edit Gain Asset Example' : 'Add Real Example to Gain'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add a real company example for analysts to reference in Gain.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Asset / Company Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Asset / Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={assetName}
              onChange={(e) => {
                setAssetName(e.target.value);
                if (errors.assetName) setErrors({ ...errors, assetName: undefined });
              }}
              placeholder="e.g. Lucid Group, Inc. (formerly Churchill Capital IV)"
              className={`w-full text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.assetName ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.assetName && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.assetName}</p>}
          </div>

          {/* Gain Asset URL */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Gain Asset URL</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 normal-case font-normal">Opens in new tab when clicked</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={gainAssetUrl}
                onChange={(e) => setGainAssetUrl(e.target.value)}
                placeholder="https://gain.ai/assets/your-company-identifier"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Ticker and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Ticker / Identifier
              </label>
              <input
                type="text"
                value={tickerOrIdentifier}
                onChange={(e) => setTickerOrIdentifier(e.target.value)}
                placeholder="e.g. NASDAQ: LCID"
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Transaction Year / Period
              </label>
              <input
                type="text"
                value={transactionYear}
                onChange={(e) => setTransactionYear(e.target.value)}
                placeholder="e.g. 2021, 2020-2023"
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Why this is a useful example */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Why this is a useful example (Notes)</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 normal-case font-normal">Context for analysts</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain how this specific company exemplifies the case (e.g. PIPE anchor commitments, reverse Morris trust structure, debt-for-equity swap)..."
              className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Key Takeaway */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Key Database Takeaway (Optional)
            </label>
            <input
              type="text"
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              placeholder="e.g. Review how the conversion price and derivative overlay were recorded in Gain."
              className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Associated Case Types (Multi-select) */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Associated Case Types <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 normal-case font-normal">Select all that apply</span>
            </label>
            <div className="max-h-36 overflow-y-auto border border-slate-300 dark:border-slate-700 rounded-lg p-2 space-y-1 bg-slate-50/50 dark:bg-slate-800/60">
              {allCaseTypes.map((ct) => {
                const isSelected = selectedCaseTypeIds.includes(ct.id);
                return (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => toggleCaseType(ct.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="truncate">{ct.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {errors.caseTypeIds && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.caseTypeIds}</p>}
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-2 transition-colors">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              {initialData ? 'Save Example' : 'Add Example'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
