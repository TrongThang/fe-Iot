import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export default function DeviceShareSection({ device }) {
  return (
    <Card className="mb-4">
      <CardContent className="py-6 px-4 md:px-8">
        <div className="flex items-center gap-2 text-lg font-semibold mb-2">
          <Share2 className="w-5 h-5" />
          Chia sẻ thiết bị
        </div>
        <div className="text-gray-500 text-sm mb-4">
          Chia sẻ thiết bị với người dùng khác để họ có thể xem hoặc điều khiển thiết bị.
        </div>
        <Button variant="outline" className="w-full max-w-xs">
          <Share2 className="w-4 h-4 mr-2" />
          Chia sẻ thiết bị
        </Button>
      </CardContent>
    </Card>
  );
} 