import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  className = '' 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800',
          label: 'Draft'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending Approval'
        };
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800',
          label: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          label: 'Rejected'
        };
      case 'archived':
        return {
          color: 'bg-gray-100 text-gray-600',
          label: 'Archived'
        };
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          label: 'Active'
        };
      case 'inactive':
        return {
          color: 'bg-gray-100 text-gray-600',
          label: 'Inactive'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          label: status
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span 
      className={`inline-flex items-center font-semibold rounded-full ${config.color} ${sizeClasses} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;