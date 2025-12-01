import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {children}
    </div>
  );
}

