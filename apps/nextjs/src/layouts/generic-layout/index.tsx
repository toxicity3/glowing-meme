import { cn } from '~/utils/utils';

interface GenericLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function GenericLayout({
  children,
  className,
}: GenericLayoutProps): JSX.Element {
  return (
    <main
      className={cn(
        'flex h-screen flex-col items-center h-100 data-theme:dark',
        className,
      )}
    >
      {children}
    </main>
  );
}
