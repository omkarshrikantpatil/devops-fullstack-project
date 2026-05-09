import { Badge } from '@/components/ui/badge';

type StatusType = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled' | 'paid' | 'failed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
      case 'expired':
      case 'cancelled':
        return 'outline';
      case 'rejected':
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getLabel = (): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getCustomClasses = (): string => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'inactive':
      case 'expired':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant()} className={`${getCustomClasses()} ${className}`}>
      {getLabel()}
    </Badge>
  );
}
