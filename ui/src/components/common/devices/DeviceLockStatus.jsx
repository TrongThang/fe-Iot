import React from 'react';
import { Badge } from '../../ui/badge';
import { Lock, Unlock } from 'lucide-react';

const DeviceLockStatus = ({ device, showIcon = true, size = 'sm' }) => {
    const isLocked = device?.lock_status === 'locked';
    
    const sizeClasses = {
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5'
    };

    const iconSizes = {
        xs: 'w-2.5 h-2.5',
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4'
    };

    if (isLocked) {
        return (
            <Badge 
                variant="destructive" 
                className={`${sizeClasses[size]} flex items-center gap-1`}
            >
                {showIcon && <Lock className={iconSizes[size]} />}
                Đã khóa
            </Badge>
        );
    }

    return (
        <Badge 
            variant="secondary" 
            className={`${sizeClasses[size]} flex items-center gap-1 bg-green-50 text-green-700 border-green-200`}
        >
            {showIcon && <Unlock className={iconSizes[size]} />}
            Hoạt động
        </Badge>
    );
};

export default DeviceLockStatus; 