import React from 'react';

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const Routes = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const Route = ({ element }: { element?: React.ReactNode }) => <>{element ?? null}</>;
export const Navigate = () => null;
export const Link = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <a href={to}>{children}</a>
);
export const useNavigate = () => jest.fn();
