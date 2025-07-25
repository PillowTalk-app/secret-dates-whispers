import { useContentSecurity } from '@/hooks/useContentSecurity';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

export const SecurityWrapper = ({ children }: SecurityWrapperProps) => {
  useContentSecurity();

  return <>{children}</>;
};