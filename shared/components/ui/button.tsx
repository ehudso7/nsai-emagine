import { cn } from '@/shared/lib/utils';

export function Button({
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50',
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}