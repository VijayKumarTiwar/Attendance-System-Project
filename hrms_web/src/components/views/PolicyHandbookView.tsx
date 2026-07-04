'use client';

import React, { useState } from 'react';
import { Search, BookOpen, Download, FileText, ChevronDown, ChevronUp, Star, Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import { initialPolicies, PolicyDocument } from '../../utils/mockData';

export default function PolicyHandbookView({ setView }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'HR' | 'IT' | 'Finance' | 'Conduct' | 'Benefits'>('All');
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);

  // Filter policies based on category and search
  const filteredPolicies = initialPolicies.filter((policy) => {
    const matchesTab = activeTab === 'All' || policy.category === activeTab;
    const matchesSearch =
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryColor = (category: PolicyDocument['category']) => {
    switch (category) {
      case 'HR':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-450';
      case 'IT':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450';
      case 'Finance':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450';
      case 'Conduct':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-450';
      case 'Benefits':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryLabel = (category: PolicyDocument['category']) => {
    switch (category) {
      case 'HR': return 'HR Policies';
      case 'IT': return 'IT & Cybersecurity';
      case 'Finance': return 'Finance & Expenses';
      case 'Conduct': return 'Code of Conduct';
      case 'Benefits': return 'Employee Benefits';
      default: return category;
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedPolicyId === id) {
      setExpandedPolicyId(null);
    } else {
      setExpandedPolicyId(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Policy Handbook</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Access company rules, guidelines, compliance documents, and frameworks</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm outline-none shadow-sm focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-250 dark:border-slate-800 pb-2">
        {[
          { label: 'All Policies', value: 'All' },
          { label: 'HR Policies', value: 'HR' },
          { label: 'IT & Security', value: 'IT' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Code of Conduct', value: 'Conduct' },
          { label: 'Benefits', value: 'Benefits' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.value
                ? 'bg-[#1a3b38] text-white dark:bg-emerald-500 dark:text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pinned/Featured Policies at Top */}
      {activeTab === 'All' && searchQuery === '' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Pinned & Essential Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {initialPolicies.filter(p => p.pinned).map(policy => (
              <div
                key={`pinned-${policy.id}`}
                onClick={() => toggleExpand(policy.id)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 p-5 rounded-3xl shadow-sm cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-bl-full flex items-start justify-end p-2.5">
                  <Star className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-450 fill-emerald-500 dark:fill-emerald-450" />
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getBadgeColor(policy.category)}`}>
                    {getCategoryLabel(policy.category)}
                  </span>
                  <h3 className="font-bold text-slate-800 dark:text-white mt-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {policy.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                    {policy.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 dark:border-slate-800/60 pt-3">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {policy.docCount} Attachments
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Updated {policy.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Policy Grid / List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          {activeTab === 'All' ? 'All Handbooks & Policies' : `${getCategoryLabel(activeTab)}`}
        </h2>
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
            <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No policies found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPolicies.map((policy) => {
              const isExpanded = expandedPolicyId === policy.id;

              return (
                <div
                  key={policy.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm transition-all"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpand(policy.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors select-none"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-[#1a3b38] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-800 dark:text-white">{policy.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getBadgeColor(policy.category)}`}>
                            {getCategoryLabel(policy.category)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-normal">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-slate-400">
                      <div className="hidden sm:flex flex-col text-right text-[11px] shrink-0">
                        <span className="font-bold text-slate-600 dark:text-slate-300">{policy.docCount} Documents</span>
                        <span>Updated {policy.lastUpdated}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/5 p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Policy Overview</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            This document contains the official regulations and guidelines regarding {policy.title.toLowerCase()}. All employees are required to review the attached details and comply with the guidelines. For clarification or queries, please contact the human resources department.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Documents & Guidelines</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {policy.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-emerald-500/25 transition-all group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="h-8 w-8 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 flex items-center justify-center shrink-0">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                                    <p className="text-[10px] text-slate-400">{doc.size}</p>
                                  </div>
                                </div>
                                <button className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Utility mapper inside this view file
function getBadgeColor(category: string) {
  switch (category) {
    case 'HR':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800';
    case 'IT':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-800';
    case 'Finance':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-800';
    case 'Conduct':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800';
    case 'Benefits':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-850 dark:text-slate-400';
  }
}
