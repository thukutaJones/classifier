import { Check } from 'lucide-react';
import { Annotation } from '@/types/types';

interface AnnotationTableProps {
  annotations: Annotation[];
}

export default function AnnotationTable({ annotations }: AnnotationTableProps) {
  if (annotations.length === 0) return null;

  return (
    <div className="mt-8 border bg-white/50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Session Logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-medium">Clip Timestamp</th>
              <th className="px-6 py-3 font-medium">Class</th>
              <th className="px-6 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {annotations.map((ann) => (
              <tr key={ann.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-3 font-mono text-emerald-700 dark:text-emerald-400">
                  {ann.startTime.toFixed(1)}s - {ann.endTime.toFixed(1)}s
                </td>
                <td className="px-6 py-3">
                  <span className="px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md">
                    {ann.classification.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Saved</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}