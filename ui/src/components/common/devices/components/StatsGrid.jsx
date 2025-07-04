import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
    Thermometer, 
    Droplets, 
    Wind, 
    Lightbulb, 
    Palette 
} from "lucide-react";
import { statsHelpers } from '../utils/deviceUtils';

// Icon mapping for stats
const iconMap = {
    "Thermometer": Thermometer,
    "Droplets": Droplets,
    "Wind": Wind,
    "Lightbulb": Lightbulb,
    "Palette": Palette
};

const StatsGrid = ({ capabilities, currentValues }) => {
    const stats = statsHelpers.generateStats(capabilities, currentValues);

    return (
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon];
                
                return (
                    <Card key={index}>
                        <CardContent className="p-4 text-center">
                            <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                            <div className="text-lg font-semibold">{stat.value}</div>
                            <p className="text-sm text-slate-600">{stat.label}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StatsGrid; 