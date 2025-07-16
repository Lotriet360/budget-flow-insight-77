
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover:bg-accent p-2 rounded-lg transition-colors" />
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
