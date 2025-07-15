import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deviceValueHelpers } from '../utils/deviceUtils';

const DeviceCapabilitiesInfo = ({ device, capabilities }) => {
    const getDeviceId = () => deviceValueHelpers.getDeviceId(device);

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Khả năng thiết bị</h3>
                <div className="flex flex-wrap gap-2">
                    {capabilities?.capabilities?.map((capability) => (
                        <Badge key={capability} variant="outline">
                            {capability.replace(/_/g, " ")}
                        </Badge>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="text-sm text-slate-600">
                        Danh mục: <span className="font-medium text-white">{capabilities?.category}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2 text-white">
                        Device ID: {getDeviceId()} | Serial: {device?.serial_number}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DeviceCapabilitiesInfo; 