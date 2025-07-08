import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Unlock, User, Calendar, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeviceSecuritySection({ device }) {
  // Giả lập trạng thái, có thể lấy từ props hoặc context thực tế
  const isLocked = device?.lock_status === 'locked';
  const owner = device?.owner_name || 'Bạn';
  const lastUpdate = device?.last_update || device?.updated_at || new Date().toLocaleString();
  const serial = device?.serial_number || device?.serial || '---';

  return (
    <Card className="mb-4">
      <CardContent className="py-6 px-4 md:px-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            {isLocked ? <Lock className="text-red-500 w-5 h-5" /> : <Unlock className="text-green-500 w-5 h-5" />}
            Thiết bị đang {isLocked ? 'bị khoá' : 'hoạt động'}
          </div>
          <Button size="sm" variant={isLocked ? 'default' : 'outline'} className="ml-2">
            {isLocked ? 'Mở khoá' : 'Khoá khẩn cấp'}
          </Button>
        </div>
        <div className="text-gray-500 text-sm mb-4">
          Thiết bị có thể {isLocked ? 'không thể điều khiển' : 'được điều khiển bình thường'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>Chủ sở hữu:</span>
            <span className="font-medium text-gray-700">{owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Cập nhật cuối:</span>
            <span className="font-medium text-gray-700">{lastUpdate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-400" />
            <span>Serial:</span>
            <span className="font-mono text-gray-700">{serial}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 