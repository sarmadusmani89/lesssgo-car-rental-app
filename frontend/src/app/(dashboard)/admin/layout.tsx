import ClientAdminWrapper from '@/components/pages/admin/ClientAdminWrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAdminWrapper>{children}</ClientAdminWrapper>;
}
