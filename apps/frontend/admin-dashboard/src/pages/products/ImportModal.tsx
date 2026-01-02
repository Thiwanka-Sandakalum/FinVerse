import React, { useRef } from 'react';
import { Modal, Button } from '../ui/common';
import { AlertCircle, FileSpreadsheet, Upload, Download } from 'lucide-react';

interface ImportModalProps {
    isImportOpen: boolean;
    setIsImportOpen: (open: boolean) => void;
    importFile: File | null;
    setImportFile: (file: File | null) => void;
    isImporting: boolean;
    processImport: () => void;
    handleDownloadTemplate: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
    isImportOpen, setIsImportOpen, importFile, setImportFile, isImporting, processImport, handleDownloadTemplate, fileInputRef, handleFileChange
}) => (
    <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="Import Products">
        <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">CSV Formatting Guide</h4>
                        <p className="text-xs text-slate-500 mb-3">Ensure your CSV file matches the schema below. Headers are required.</p>
                        <div className="overflow-hidden rounded border border-slate-200">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100 text-slate-600">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Column</th>
                                        <th className="px-3 py-2 font-medium">Required</th>
                                        <th className="px-3 py-2 font-medium">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    <tr><td className="px-3 py-2">Name</td><td className="px-3 py-2 text-red-600">Yes</td><td className="px-3 py-2 text-slate-500">Product Name</td></tr>
                                    <tr><td className="px-3 py-2">Code</td><td className="px-3 py-2 text-red-600">Yes</td><td className="px-3 py-2 text-slate-500">Unique ID (e.g. PL-001)</td></tr>
                                    <tr><td className="px-3 py-2">Type</td><td className="px-3 py-2 text-red-600">Yes</td><td className="px-3 py-2 text-slate-500">Loan, Card, Lease, Account</td></tr>
                                    <tr><td className="px-3 py-2">MinAmount</td><td className="px-3 py-2">No</td><td className="px-3 py-2 text-slate-500">Numeric value</td></tr>
                                    <tr><td className="px-3 py-2">Status</td><td className="px-3 py-2">No</td><td className="px-3 py-2 text-slate-500">Active, Draft (Default: Draft)</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${importFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                {importFile ? (
                    <>
                        <FileSpreadsheet className="w-10 h-10 text-indigo-600 mb-3" />
                        <p className="text-sm font-medium text-slate-900">{importFile.name}</p>
                        <p className="text-xs text-slate-500">{(importFile.size / 1024).toFixed(2)} KB</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={e => { e.stopPropagation(); setImportFile(null); }}>Remove</Button>
                    </>
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-slate-400 mb-3" />
                        <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500">CSV files only (max 5MB)</p>
                    </>
                )}
            </div>
            <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
                    <Download className="w-4 h-4 mr-2" /> Download Template
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                    <Button onClick={processImport} disabled={!importFile || isImporting} loading={isImporting}>
                        {isImporting ? 'Processing...' : 'Import Products'}
                    </Button>
                </div>
            </div>
        </div>
    </Modal>
);
