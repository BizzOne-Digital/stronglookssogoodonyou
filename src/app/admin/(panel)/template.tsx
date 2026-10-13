/** All admin panel routes are dynamic (Mongo + session). */
export const instant = false;

export default function AdminPanelTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
