interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}

export const Checkbox = ({ id, checked, onChange, label, hint }: CheckboxProps) => {
  return (
    <label htmlFor={id} className="toggle-row" style={{ cursor: 'pointer' }}>
      <div
        className={`toggle-box ${checked ? 'checked' : ''}`}
        onClick={() => onChange(!checked)}
        id={id}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && onChange(!checked)}
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#0a0e1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span>
        <span className="toggle-label">{label}</span>
        {hint && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 6 }}>
            {hint}
          </span>
        )}
      </span>
    </label>
  );
};
