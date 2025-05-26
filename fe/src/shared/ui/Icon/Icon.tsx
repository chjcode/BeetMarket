import { iconMap, IconName } from "./iconMap";

export const Icon = ({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) => {
  const IconComponent = iconMap[name];
  return <IconComponent className={className} />;
}; 