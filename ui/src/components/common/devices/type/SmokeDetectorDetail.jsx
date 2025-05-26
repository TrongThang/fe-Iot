import { Flame } from "lucide-react";
import HeaderDeviceDetail from "../HeaderDeviceDetail";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import ActionDetail from "../ActionDetail";

export default function SmokeDetectorDetail({ device }) {
    return (
        <div>
            {/* Header thẻ*/}
            <HeaderDeviceDetail icon={<Flame size={48} className="text-white" />} status="Online" isOn={device.isOn} />

            {/* Content - Nội dung thẻ */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Khí gas:</span>
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{device.ppm}ppm</span>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                </div>
                {/* Slider  - Khí gas*/}
                <div className="mb-6 flex justify-center">
                    <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className={cn("w-[100%]")}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Nhiệt độ:</span>
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{device.temp}°</span>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                </div>
                {/* Slider  - Nhiệt độ*/}
                <div className="mb-6 flex justify-center">
                    <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className={cn("w-[100%]")}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Độ ẩm:</span>
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{device.temp}%</span>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                </div>
                {/* Slider  - Độ ẩm*/}
                <div className="mb-6 flex justify-center">
                    <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className={cn("w-[100%]")}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <ActionDetail lock={() => {}} disconnect={() => {}} share={() => {}} reset={() => {}} transfer={() => {}} version={() => {}} alert={() => {}} />
        </div>
    )
}