export default function HeaderDeviceDetail({icon, status, isOn}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isOn} readOnly />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="flex items-center justify-center w-24 h-24 bg-red-500 rounded-full">
                    {icon}
                </div>
            </div>

            {/* Status Indicators */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Trạng thái hiện tại:</span>
                    <span className="font-semibold">Báo động</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Kết nối:</span>
                    <div className="flex items-center">
                        <div className={`w-2 h-2 bg-${status === "Online" ? "green" : "red"}-500 rounded-full mr-2`}></div>
                        <span>{status}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}