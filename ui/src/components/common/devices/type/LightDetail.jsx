import { Bold, Lightbulb } from "lucide-react";
import HeaderDeviceDetail from "../HeaderDeviceDetail";
import ActionDetail from "../ActionDetail";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import SimpleTimePicker from "@/components/ui/SimpleTimePicker";

export default function LightDetail({ device }) {
    const [selectedDay, setSelectedDay] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);
    const dayOfWeek = [
        { id: 0, name: "CN" }, { id: 1, name: "T2" },
        {id: 2, name: "T3"}, {id: 3, name: "T4"}, {id: 4, name: "T5"},
        {id: 5, name: "T6"}, { id: 6, name: "T7" },
    ];

    const handleDayClick = (day) => {
        if (selectedDay.includes(day)) {
            setSelectedDay(selectedDay.filter((d) => d !== day));
        } else {
            setSelectedDay([...selectedDay, day ]);
        }
    }
    
    const handleTimeClick = (time) => {
        setSelectedTime([...selectedTime, time]);
    }

    return (
        <div>
            <HeaderDeviceDetail icon={<Lightbulb size={48} className="text-white" />} status="Online" isOn={device.isOn} />
            <div className="flex justify-between items-center">
                <span className="text-gray-300">Độ sáng:</span>
                <span className="text-2xl font-bold mr-2">{device.brightness}%</span>
            </div>
            <div className="mb-6 flex justify-center">
                <Slider
                    value={[device.brightness]}
                    max={100}
                    step={1}
                    className={cn("w-[100%]")}
                    onValueChange={(value) => {
                        alert(value)
                    }}
                />
            </div>
            {/* SECTION SELECT TIME */}
            <div className="mb-6">
                <p className="flex justify-center mb-4">Chọn giờ</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                    <SimpleTimePicker onTimeChange={handleTimeClick}/>
                </div>
            </div>

            <div className="mb-6">
                <p className="flex justify-center mb-4">Chọn ngày</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                    {dayOfWeek.map((day) => (
                        <Toggle aria-label="Toggle bold" className="w-32 h-14" key={day.id} onClick={() => handleDayClick(day.id)}>
                            {day.name}
                        </Toggle>
                    ))}
                </div>
            </div>

            <ActionDetail lock={() => {}} disconnect={() => {}} share={() => {}} reset={() => {}} transfer={() => {}} version={() => {}} alert={() => {}} />
        </div>
    )
}