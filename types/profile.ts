export type MenuItem = {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  href?: "/edit-profile" | "/privacy";
  onPress?: () => void;
};
