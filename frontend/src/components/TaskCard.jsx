import React from 'react';
import { Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { _id, title, description, status, priority, dueDate } = task;
  const isCompleted = status === 'completed';

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if date is overdue
  const isOverdue = () => {
    if (!dueDate || isCompleted) return false;
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  const priorityStyles = {
    high: 'bg-rose-500/10 text-rose-450 border-rose-500/25',
    medium: 'bg-amber-500/10 text-amber-450 border-amber-500/25',
    low: 'bg-emerald-500/10 text-emerald-450 border-emerald-500/25',
  };

  return (
    <div className={`group relative flex flex-col justify-between rounded-2xl border bg-slate-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-black/20 ${isCompleted ? 'border-slate-800/60 opacity-60' : 'border-slate-800'}`}>
      
      <div>
        {/* Priority & Actions */}
        <div className="flex items-center justify-between mb-3.5">
          <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${priorityStyles[priority]}`}>
            {priority}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(_id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Status */}
        <h3 className="text-lg font-bold tracking-tight text-slate-100 mb-2 flex items-start gap-3">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onStatusChange(_id, isCompleted ? 'pending' : 'completed')}
            className="mt-1 h-5 w-5 rounded-md border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer accent-violet-600 shrink-0"
          />
          <span className={`leading-snug break-words ${isCompleted ? 'line-through text-slate-550 font-normal' : ''}`}>
            {title}
          </span>
        </h3>

        {/* Description */}
        {description && (
          <p className={`text-sm text-slate-450 mb-4 line-clamp-3 leading-relaxed break-words ${isCompleted ? 'text-slate-600' : ''}`}>
            {description}
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className={`flex items-center gap-1.5 ${isOverdue() ? 'text-rose-400 font-medium' : ''}`}>
          <Calendar className="w-4 h-4" />
          <span>{formatDate(dueDate)}</span>
          {isOverdue() && (
            <span className="flex items-center gap-0.5 text-[10px] bg-rose-500/10 border border-rose-500/25 px-1.5 py-0.5 rounded-md ml-1">
              <AlertCircle className="w-3 h-3 text-rose-400" /> Overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
