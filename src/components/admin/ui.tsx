import { useEffect } from 'react';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export const Card = ({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm ${
      padded ? 'p-6' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export const SectionHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ---------------------------------------------------------------------------
// Stat tile — a headline number, not a chart
// ---------------------------------------------------------------------------

export const StatTile = ({
  label,
  value,
  hint,
  trend,
  icon,
  tone = 'default',
  onClick,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: number; label?: string };
  icon?: ReactNode;
  tone?: 'default' | 'blue' | 'amber' | 'green' | 'red';
  onClick?: () => void;
}) => {
  const tones: Record<string, string> = {
    default: 'bg-gray-100 text-gray-600',
    blue: 'bg-[#225AE3]/10 text-[#225AE3]',
    amber: 'bg-[#F59E0B]/10 text-[#B45309]',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-600',
  };

  const shell = `w-full text-left bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 transition-all duration-200 ${
    onClick ? 'hover:shadow-md hover:border-[#225AE3]/30 cursor-pointer' : ''
  }`;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${tones[tone]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-black text-gray-900 tabular-nums">{value}</p>
      <div className="mt-1 flex items-center gap-2 flex-wrap">
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold ${
              trend.value > 0
                ? 'text-emerald-700'
                : trend.value < 0
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            {trend.value > 0 ? '▲' : trend.value < 0 ? '▼' : '■'}{' '}
            {Math.abs(trend.value)}% {trend.label ?? ''}
          </span>
        )}
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
    </>
  );

  return onClick ? (
    <button type="button" onClick={onClick} className={shell}>
      {body}
    </button>
  ) : (
    <div className={shell}>{body}</div>
  );
};

// ---------------------------------------------------------------------------
// Badges — status carries a label, never colour alone
// ---------------------------------------------------------------------------

const LEAD_STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#225AE3]/10 text-[#1B49B6] border-[#225AE3]/20',
  assigned: 'bg-violet-50 text-violet-700 border-violet-200',
  accepted: 'bg-sky-50 text-sky-700 border-sky-200',
  in_progress: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

export const Badge = ({
  status,
  label,
  className = '',
}: {
  status: string;
  label?: string;
  className?: string;
}) => {
  const style = LEAD_STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  const text = label ?? status.replace(/_/g, ' ');
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold capitalize whitespace-nowrap ${style} ${className}`}
    >
      {text}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  title?: string;
};

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  title,
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-sm hover:shadow-md',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:border-[#225AE3]/50 hover:text-[#225AE3]',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
  };

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// ---------------------------------------------------------------------------
// Form fields
// ---------------------------------------------------------------------------

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-[#225AE3] focus:ring-2 focus:ring-[#225AE3]/20 outline-none transition-all duration-200 bg-white disabled:bg-gray-50 disabled:text-gray-500';

export const Field = ({
  label,
  children,
  hint,
  className = '',
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) => (
  <label className={`block ${className}`}>
    <span className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
      {label}
    </span>
    {children}
    {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
  </label>
);

export const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${fieldClass} ${props.className ?? ''}`} />
);

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`${fieldClass} ${props.className ?? ''}`} />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`${fieldClass} ${props.className ?? ''}`} />
);

export const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-[#225AE3] focus:ring-[#225AE3]/30"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widths[size]} bg-white rounded-2xl shadow-2xl my-8 animate-[fadeInUp_0.2s_ease-out]`}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 -m-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/60 rounded-b-2xl flex flex-wrap justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
          {busy ? 'Working…' : confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
  </Modal>
);

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export const Spinner = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <div
    className={`animate-spin rounded-full border-2 border-[#225AE3] border-t-transparent ${className}`}
  />
);

export const LoadingBlock = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <Spinner />
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export const EmptyState = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) => (
  <div className="text-center py-16 px-6">
    <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h3 className="text-base font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{message}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorBlock = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    <div className="flex-1">
      <p className="text-sm font-semibold text-red-800">Something went wrong</p>
      <p className="text-sm text-red-700 mt-0.5">{message}</p>
    </div>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Table shell + pagination
// ---------------------------------------------------------------------------

export const TableShell = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">{children}</table>
  </div>
);

export const Th = ({
  children,
  className = '',
  sortKey,
  activeSort,
  onSort,
}: {
  children?: ReactNode;
  className?: string;
  sortKey?: string;
  activeSort?: string;
  onSort?: (key: string) => void;
}) => {
  const isActive = sortKey && (activeSort === sortKey || activeSort === `-${sortKey}`);
  const descending = activeSort === `-${sortKey}`;

  return (
    <th
      className={`text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-4 py-3 border-b border-gray-200 whitespace-nowrap ${className}`}
    >
      {sortKey && onSort ? (
        <button
          onClick={() => onSort(sortKey)}
          className={`inline-flex items-center gap-1 hover:text-[#225AE3] transition-colors ${
            isActive ? 'text-[#225AE3]' : ''
          }`}
        >
          {children}
          <span className="text-[10px]">{isActive ? (descending ? '▼' : '▲') : '↕'}</span>
        </button>
      ) : (
        children
      )}
    </th>
  );
};

export const Td = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <td className={`px-4 py-3 border-b border-gray-100 align-middle ${className}`}>{children}</td>
);

export const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-200">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-700">{from}–{to}</span> of{' '}
        <span className="font-semibold text-gray-700">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </Button>
        <span className="text-xs text-gray-600 px-2">
          Page {page} of {pages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Toast stack
// ---------------------------------------------------------------------------

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const ToastStack = ({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) => (
  <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 max-w-sm">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-start gap-3 rounded-xl shadow-lg border px-4 py-3 bg-white ${
          toast.type === 'success' ? 'border-emerald-200' : 'border-red-200'
        }`}
      >
        <span
          className={`mt-0.5 flex-shrink-0 ${
            toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          )}
        </span>
        <p className="text-sm text-gray-800 flex-1">{toast.message}</p>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ))}
  </div>
);
