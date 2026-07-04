'use client';

import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Calendar, File, FileCode, CheckCircle, Clock, AlertTriangle, Plus, X, ArrowLeft, RefreshCw } from 'lucide-react';

interface DocItem {
  id: string;
  name: string;
  category: 'ID Proof' | 'Educational' | 'Employment' | 'Letters' | 'Certificates';
  size: string;
  uploadedAt: string;
  expiry?: string;
  status: 'Verified' | 'Pending' | 'Expired';
  format: 'pdf' | 'doc' | 'img';
}

export default function DocumentRecordsView({ setView }: any) {
  const [activeTab, setActiveTab] = useState<'All' | 'ID Proof' | 'Educational' | 'Employment' | 'Letters' | 'Certificates'>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState<DocItem[]>([
    { id: '1', name: 'Aadhaar Card.pdf', category: 'ID Proof', size: '2.1 MB', uploadedAt: '12 Jan 2024', status: 'Verified', format: 'pdf' },
    { id: '2', name: 'PAN Card.pdf', category: 'ID Proof', size: '1.4 MB', uploadedAt: '12 Jan 2024', status: 'Verified', format: 'pdf' },
    { id: '3', name: 'Passport.pdf', category: 'ID Proof', size: '3.2 MB', uploadedAt: '15 Mar 2024', expiry: '12 Dec 2028', status: 'Verified', format: 'pdf' },
    { id: '4', name: 'Degree Certificate.pdf', category: 'Educational', size: '4.5 MB', uploadedAt: '20 Jan 2024', status: 'Verified', format: 'pdf' },
    { id: '5', name: 'Mark Sheet.pdf', category: 'Educational', size: '2.8 MB', uploadedAt: '20 Jan 2024', status: 'Verified', format: 'pdf' },
    { id: '6', name: 'Offer Letter.pdf', category: 'Employment', size: '1.2 MB', uploadedAt: '01 Jan 2024', status: 'Verified', format: 'pdf' },
    { id: '7', name: 'Appointment Letter.pdf', category: 'Employment', size: '1.1 MB', uploadedAt: '05 Jan 2024', status: 'Verified', format: 'pdf' },
    { id: '8', name: 'Increment Letter June 2025.pdf', category: 'Letters', size: '890 KB', uploadedAt: '15 Jun 2025', status: 'Verified', format: 'pdf' },
    { id: '9', name: 'Experience Certificate.pdf', category: 'Employment', size: '1.3 MB', uploadedAt: '10 May 2026', status: 'Pending', format: 'pdf' },
    { id: '10', name: 'Blood Test Report.pdf', category: 'Certificates', size: '2.4 MB', uploadedAt: '25 May 2026', status: 'Pending', format: 'pdf' },
    { id: '11', name: 'Driving License.pdf', category: 'ID Proof', size: '1.8 MB', uploadedAt: '14 Feb 2024', expiry: '14 Mar 2027', status: 'Verified', format: 'pdf' },
    { id: '12', name: 'Professional Certification.pdf', category: 'Certificates', size: '1.6 MB', uploadedAt: '28 Aug 2025', status: 'Verified', format: 'pdf' },
  ]);

  // Form States for Upload
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocItem['category']>('ID Proof');
  const [newDocExpiry, setNewDocExpiry] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document from the vault?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    const newDoc: DocItem = {
      id: `doc-${Date.now()}`,
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      category: newDocCategory,
      size: '1.5 MB',
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiry: newDocExpiry || undefined,
      status: 'Pending',
      format: 'pdf',
    };

    setDocuments(prev => [newDoc, ...prev]);
    setShowUploadModal(false);
    setNewDocName('');
    setNewDocExpiry('');
    alert('Document uploaded successfully. Verification pending.');
  };

  const filteredDocs = documents.filter(d => activeTab === 'All' || d.category === activeTab);

  // Stats
  const totalCount = documents.length;
  const verifiedCount = documents.filter(d => d.status === 'Verified').length;
  const pendingCount = documents.filter(d => d.status === 'Pending').length;
  const expiringSoonCount = documents.filter(d => d.expiry && new Date(d.expiry) < new Date('2028-12-31')).length;

  const getFormatStyle = (format: DocItem['format']) => {
    switch (format) {
      case 'pdf': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30';
      case 'doc': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Document Records</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Secure digital locker for storing government ids, certifications and correspondence</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition-colors w-fit"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Locker Vault', count: totalCount, border: 'border-l-slate-450', icon: FileText, color: 'text-slate-500' },
          { label: 'Verified Files', count: verifiedCount, border: 'border-l-emerald-500', icon: CheckCircle, color: 'text-emerald-500' },
          { label: 'Verification Pending', count: pendingCount, border: 'border-l-amber-500', icon: Clock, color: 'text-amber-500' },
          { label: 'Expiring Soon', count: expiringSoonCount, border: 'border-l-red-500', icon: AlertTriangle, color: 'text-red-550' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 ${stat.border} flex justify-between items-center`}>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{stat.count}</p>
              </div>
              <Icon className={`h-6 w-6 ${stat.color} opacity-40`} />
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'All', label: 'All Files' },
          { id: 'ID Proof', label: 'ID Proofs' },
          { id: 'Educational', label: 'Educational' },
          { id: 'Employment', label: 'Employment' },
          { id: 'Letters', label: 'Letters / Forms' },
          { id: 'Certificates', label: 'Certificates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#1a3b38] text-white dark:bg-emerald-500 dark:text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Documents */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <File className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">No files found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase border ${getFormatStyle(doc.format)}`}>
                    {doc.format}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                    doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-800' :
                    doc.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-800' :
                    'bg-red-50 text-red-700 border-red-150 dark:bg-red-950/20 dark:text-red-450'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-450 truncate transition-colors" title={doc.name}>
                  {doc.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                  <span>Size: {doc.size}</span>
                  <span>•</span>
                  <span>Uploaded: {doc.uploadedAt}</span>
                </div>

                {doc.expiry && (
                  <p className="flex items-center gap-1 mt-3 text-[10px] font-bold text-red-500">
                    <Calendar className="h-3 w-3" />
                    <span>Expires: {doc.expiry}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 border-t border-slate-50 dark:border-slate-800/60 mt-4 pt-3">
                <button
                  onClick={() => alert(`View document: ${doc.name}`)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => alert(`Download document: ${doc.name}`)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  title="Download File"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                  title="Delete File"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-855 dark:text-white mb-4">Upload Document to Vault</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag drop zone mock */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/10">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Drag & Drop file here</p>
                <p className="text-[10px] text-slate-400 mt-1">Supported formats: PDF, PNG, JPG (Max 5MB)</p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Document Label / Name</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  placeholder="e.g. Visa_Copy_2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="ID Proof">ID Proof</option>
                    <option value="Educational">Educational</option>
                    <option value="Employment">Employment</option>
                    <option value="Letters">Letter / Form</option>
                    <option value="Certificates">Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={newDocExpiry}
                    onChange={(e) => setNewDocExpiry(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border border-slate-250 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a3b38] dark:bg-emerald-600 hover:bg-[#122e2b] text-white rounded-xl px-5 py-2 text-xs font-semibold transition-all shadow-md"
                >
                  Upload & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
