import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { getDeviceIcon } from '../constants/deviceConstants';
import { deviceValueHelpers } from '../utils/deviceUtils';

const StatusDisplay = ({ device, capabilities, currentValues }) => {
    const IconComponent = getDeviceIcon(capabilities?.category, capabilities?.capabilities || []);
    
    // Get main display value
    const { value: mainValue, label: mainLabel } = deviceValueHelpers.getMainDisplayValue(capabilities, currentValues);
    
    // Check warning status
    const isWarning = deviceValueHelpers.hasWarningStatus(currentValues);

    return (
        <Card className={isWarning ? "border-red-200 bg-red-50" : ""}>
            <CardContent className="p-6">
                <div className="text-center">
                    <div
                        className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            isWarning 
                                ? "bg-red-100" 
                                : device.power_status 
                                    ? "bg-green-100" 
                                    : "bg-gray-100"
                        }`}
                    >
                        <IconComponent
                            className={`w-12 h-12 ${
                                isWarning 
                                    ? "text-red-500" 
                                    : device.power_status 
                                        ? "text-green-500" 
                                        : "text-gray-400"
                            }`}
                        />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{mainValue}</h3>
                    <p className="text-slate-600">{mainLabel}</p>
                    {isWarning && (
                        <Badge variant="destructive" className="mt-2">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Cảnh báo
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatusDisplay; 