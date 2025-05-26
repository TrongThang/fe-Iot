import React, { useEffect, useState } from "react";

export default function SimpleTimePicker({ onTimeChange }) {
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
    const periods = ["Sáng", "Chiều"];

    useEffect(() => {
        const formattedTime = `${hour}:${minute} ${period}`;
        onTimeChange(formattedTime);
    }, [hour, minute, period]);

    return (
        <div className="flex gap-2 items-center text-black">
            <select className="border rounded p-2" value={hour} onChange={(e) => setHour(e.target.value)}>
                {hours.map(h => <option key={h} value={h}>{h} Giờ</option>)}
            </select>
            <select className="border rounded p-2" value={minute} onChange={(e) => setMinute(e.target.value)}>
                {minutes.map(m => <option key={m} value={m}>{m} phút</option>)}
            </select>
            <select className="border rounded p-2" value={period} onChange={(e) => setPeriod(e.target.value)}>
                {periods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
    );
}
