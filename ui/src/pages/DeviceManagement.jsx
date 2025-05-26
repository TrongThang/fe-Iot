"use client"
import { useState } from "react"
import { ChevronLeft, Bell, Settings, Clock, Edit, Trash2, ChevronDown, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import LightDetail from "@/components/common/devices/type/LightDetail"
import SmokeDetectorDetail from "@/components/common/devices/type/SmokeDetectorDetail"

export default function DeviceManagement() {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [devices] = useState([
    { id: 1, name: "Máy báo khói", room: "Phòng khách", type: "smoke", isOn: true, ppm: 1024, temp: 34 },
    { id: 2, name: "Máy báo khói", room: "Phòng khách", type: "smoke", isOn: false, ppm: 1024, temp: 34 },
    { id: 3, name: "Đèn bàn", room: "Phòng khách", type: "light", isOn: true, brightness: 50, color: "red", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1" },
  ])
  const [selectedOption, setSelectedOption] = useState({
    group: 0,
    house: 0,
  })  

  const handleDeviceChange = (device) => {
    setSelectedDevice(device)
  }
  
  const handleDeviceClick = (device) => {
    setSelectedDevice(device)
  }

  const handleBackClick = () => {
    setSelectedDevice(null)
  }

  const handleToggle = (e, deviceId) => {
    e.stopPropagation()
    // In a real app, you would update the device state here
    console.log(`Toggle device ${deviceId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center shadow-sm">
          {selectedDevice ? (
            <button onClick={handleBackClick} className="flex items-center text-lg font-semibold">
              <ChevronLeft className="mr-2" />
              Danh sách thiết bị
            </button>
          ) : (
            <h1 className="text-lg font-semibold">Danh sách thiết bị</h1>
          )}
        </header>

        <div className="flex flex-col md:flex-row">
          {/* Device List */}
          <div className={cn("bg-white p-4 w-full", selectedDevice ? "md:w-1/3" : "md:w-full")}>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <select className="w-full p-3 border rounded-md appearance-none pr-10" value={selectedOption.group} onChange={(e) => setSelectedOption({
                  ...selectedOption,
                  group: e.target.value === "" ? null : e.target.value
                })}>
                  <option value={0}>Chọn nhóm</option>
                  <option value={1}>Nhóm 1</option>
                  <option value={2}>Nhóm 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              <div>
                <select
                  className={`w-full p-3 border rounded-md appearance-none pr-10 ${selectedOption.group !== 0 ? "" : "bg-gray-200"}`}
                  value={selectedOption.house}
                  disabled={selectedOption.group === 0}
                  onChange={(e) => setSelectedOption({ ...selectedOption, house: e.target.value })}
                >
                  <option value={0}>Chọn nhà</option>
                  <option value={1}>Nhà 1</option>
                  <option value={2}>Nhà 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleDeviceClick(device)}
                  className={cn(
                    "bg-gray-200 rounded-lg p-4 cursor-pointer",
                    selectedDevice?.id === device.id && "ring-2 ring-blue-500",
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold">{device.name}</h3>
                      <p className="text-sm text-gray-600">{device.room}</p>
                      <p className="text-sm text-gray-600">{device.group_name} - {device.house_name}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={device.isOn}
                        onChange={(e) => handleToggle(e, device.id)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-1" />
                      <span>{device.timer}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Edit device ${device.id}`)
                        }}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`Delete device ${device.id}`)
                        }}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Detail */}
          {selectedDevice && (
            <div className="bg-[#213148] text-white p-4 w-full md:w-2/3 rounded-lg">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedDevice.name} {selectedDevice.room}
                </h2>

                {(() => {
                  const deviceComponents = {
                    smoke: <SmokeDetectorDetail device={selectedDevice} />,
                    light: <LightDetail device={selectedDevice} />,
                    // Thêm các loại device khác ở đây
                  };
                  
                  return deviceComponents[selectedDevice.type] || null;
                })()}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

