"use client";

import React from "react";

interface Reason {
  title: string;
  description: string;
  footer: string;
  reasons: {
    title: string;
    content: string;
  }[];
}

const Reason99notes: React.FC<Reason> = ({
  title,
  description,
  footer,
  reasons,
}) => {
  return (
    <div className="bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-800 dark:to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <span className="text-[var(--primary)] font-medium tracking-wider text-sm uppercase mb-4 font-opensans">
              Reason
            </span>
            <h2 className="text-3xl font-semibold text-[var(--surface-darker)] dark:text-white pt-2 mb-4 font-opensans">
              {title}
            </h2>
            <div className="w-24 h-1 bg-[var(--primary)] mx-auto mt-2"></div>
          </div>
          <p className="text-[var(--text-strong)] dark:text-gray-300 mt-4 max-w-2xl mx-auto font-normal font-opensans">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="border-b border-[var(--border-light)] dark:border-slate-700 pb-4 last:pb-0"
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-medium text-[var(--surface-darker)] dark:text-white font-opensans">
                  {reason.title}
                </h3>
              </div>
              <div className="mt-2">
                <p className="text-[var(--text-strong)] dark:text-gray-300 text-sm font-normal font-opensans">
                  {reason.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="bg-gradient-to-r from-[var(--bg-elevated)] to-[var(--bg-subtle)] dark:from-slate-800 dark:to-slate-700 p-10 rounded-3xl shadow-inner">
            <p className="text-lg text-[var(--text-strong)] dark:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed font-opensans">
              {footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reason99notes;
