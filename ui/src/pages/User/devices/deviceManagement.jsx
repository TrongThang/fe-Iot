"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Edit,
  Trash2,
  ChevronDown,
  Flame,
  Search,
  Plus,
  MoreHorizontal,
  Home,
  Lightbulb,
  Thermometer,
  Smartphone,
  Camera,
  Wifi,
  WifiOff,
  AlertTriangle,
  Unlink,
  DoorOpen,
  Droplets,
  Shield,
  Settings,
  Zap,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CameraControl from "./cameraControl";
import DeviceGrid from "./deviceGrid";
import DynamicDeviceDetail from "@/components/common/devices/DynamicDeviceDetail";
import RealTimeDeviceControl from "@/components/common/devices/RealTimeDeviceControl";
import { useSocketContext } from "@/contexts/SocketContext";
import axiosPublic from "@/apis/clients/public.client";
import { toast } from "sonner"; // Added for error feedback
import { deviceApi } from "@/apis/modules/deviceApi"; // Import deviceApi
import { useNavigate } from "react-router-dom";

export default function DeviceManagement({
  spaceId = "1",
  spaceName = "Danh sách thiết bị",
  spaceType = "living_room",
  onBack = () => {},
}) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enableRealTime, setEnableRealTime] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    group: 0,
    house: 0,
    status: "all",
  });

  const [devices, setDevices] = useState([]);
  
  // Socket context for real-time device communication
  const { 
    user, 
    isConnected, 
    connectToDevice,
    disconnectFromDevice,
    emergencyAlerts,
    dismissEmergencyAlert
  } = useSocketContext();

  const navigate = useNavigate();

  // Device type mapping based on categories data from database
  const getDeviceTypeFromCategory = (deviceTypeId, deviceTypeName, deviceTypeParentName, capabilities) => {
    // Categories mapping based on database structure
    const categoryMapping = {
      // Electronics & Camera
      1: 'camera', // electronics
      18: 'camera', // camera-an-ninh
      
      // LED categories
      9: 'light', // led
      11: 'led-rgb', // led-rgb
      12: 'led-white', // led-white  
      13: 'led-single', // led-single
      
      // Sensor categories
      14: 'sensor', // sensor
      15: 'smoke', // sensor-smoke-fire
      25: 'sensor', // sensors
      
      // Door categories
      19: 'door', // cua-thong-minh
      20: 'door-roller', // cua-cuon
      21: 'door-sliding', // cua-truot
      22: 'door-swing', // cua-canh
      
      // Hub categories
      23: 'hub', // hub
      24: 'hub-door', // hub-cua
      
      // Controllers
      26: 'controller', // thiet-bi-dieu-khien
      
      // Security  
      27: 'security', // thiet-bi-an-ninh
    };

    // Get base type from category mapping
    let baseType = categoryMapping[deviceTypeId] || 'device';
    
    // Enhanced type detection based on parent categories and names
    if (!baseType || baseType === 'device') {
      // Fallback to name-based detection
      const lowerName = (deviceTypeName || deviceTypeParentName || '').toLowerCase();
      console.log('🔄 Fallback name-based detection for:', {
        deviceTypeId,
        deviceTypeName,
        deviceTypeParentName,
        lowerName,
        currentBaseType: baseType
      });
      
      if (lowerName.includes('cảm biến')) {
        if (lowerName.includes('khói') || lowerName.includes('cháy') || lowerName.includes('báo cháy')) {
          baseType = 'smoke';
        } else if (lowerName.includes('nhiệt độ')) {
          baseType = 'temperature';
        } else if (lowerName.includes('môi trường') || lowerName.includes('gas') || lowerName.includes('khí') || 
                   lowerName.includes('chất lượng không khí') || lowerName.includes('air quality')) {
          baseType = 'gas-sensor';
        } else {
          baseType = 'sensor';
        }
      } else if (lowerName.includes('camera')) {
        baseType = 'camera';
      } else if (lowerName.includes('đèn') || lowerName.includes('led')) {
        if (lowerName.includes('rgb')) {
          baseType = 'led-rgb';
        } else if (lowerName.includes('white') || lowerName.includes('trắng')) {
          baseType = 'led-white';
        } else {
          baseType = 'light';
        }
      } else if (lowerName.includes('cửa')) {
        if (lowerName.includes('cuốn')) {
          baseType = 'door-roller';
        } else if (lowerName.includes('trượt')) {
          baseType = 'door-sliding';
        } else if (lowerName.includes('cánh')) {
          baseType = 'door-swing';
        } else {
          baseType = 'door';
        }
      } else if (lowerName.includes('hub')) {
        baseType = 'hub';
      } else if (lowerName.includes('bơm')) {
        baseType = 'pump';
      }
    }

    // Merge capabilities to enhance device type
    if (capabilities) {
      try {
        const caps = typeof capabilities === 'string' ? JSON.parse(capabilities) : capabilities;
        
        // Add capability-based type enhancement
        if (caps.pump_control || caps.water_flow) {
          baseType = baseType === 'device' ? 'pump' : baseType + '-pump';
        }
        if (caps.rgb_control) {
          baseType = baseType.includes('led') ? 'led-rgb' : baseType;
        }
        if (caps.temperature_sensor) {
          baseType = baseType === 'sensor' ? 'temperature' : baseType;
        }
        if (caps.smoke_detection || caps.fire_detection) {
          baseType = baseType === 'sensor' ? 'smoke' : baseType;
        }
        if (caps.gas_detection || caps.air_quality) {
          baseType = baseType === 'sensor' ? 'gas-sensor' : baseType;
        }
        if (caps.door_control) {
          baseType = baseType === 'device' ? 'door' : baseType;
        }
      } catch (error) {
        console.warn('Error parsing capabilities:', error);
      }
    }

    console.log('✅ Final device type mapping result:', {
      deviceTypeId,
      deviceTypeName,
      deviceTypeParentName,
      finalType: baseType,
      hasCapabilities: !!capabilities
    });
    
    return baseType;
  };

  // Get device type display name
  const getDeviceTypeDisplayName = (type, deviceTypeName, deviceTypeParentName) => {
         const typeNames = {
       'camera': 'Camera',
       'light': 'Đèn LED',
       'led-rgb': 'Đèn LED RGB',
       'led-white': 'Đèn LED Trắng',
       'led-single': 'Đèn LED Đơn',
       'smoke': 'Cảm biến báo khói',
       'sensor-smoke-fire': 'Cảm biến báo khói & cháy',
       'gas-sensor': 'Cảm biến môi trường',
       'temperature': 'Cảm biến nhiệt độ',
       'sensor': 'Cảm biến',
       'door': 'Cửa thông minh',
       'door-roller': 'Cửa cuốn',
       'door-sliding': 'Cửa trượt',
       'door-swing': 'Cửa cánh',
       'pump': 'Máy bơm nước',
       'hub': 'Hub điều khiển',
       'hub-door': 'Hub cửa',
       'controller': 'Thiết bị điều khiển',
       'security': 'Thiết bị an ninh',
       'device': 'Thiết bị'
     };

    return typeNames[type] || deviceTypeName || deviceTypeParentName || 'Thiết bị';
  };

  // Get device capabilities display
  const getDeviceCapabilities = (device) => {
    if (!device.device_base_capabilities) return [];

    try {
      const capabilities = typeof device.device_base_capabilities === 'string' 
        ? JSON.parse(device.device_base_capabilities) 
        : device.device_base_capabilities;

             const capabilityLabels = {
         'power_control': 'Điều khiển nguồn',
         'brightness_control': 'Điều chỉnh độ sáng',
         'color_control': 'Điều khiển màu sắc',
         'rgb_control': 'Điều khiển RGB',
         'temperature_sensor': 'Cảm biến nhiệt độ',
         'humidity_sensor': 'Cảm biến độ ẩm',
         'gas_detection': 'Phát hiện khí gas',
         'air_quality': 'Chất lượng không khí',
         'smoke_detection': 'Phát hiện khói',
         'fire_detection': 'Phát hiện lửa',
         'door_control': 'Điều khiển cửa',
         'lock_control': 'Điều khiển khóa',
         'pump_control': 'Điều khiển bơm',
         'water_flow': 'Cảm biến lưu lượng nước',
         'motion_detection': 'Phát hiện chuyển động',
         'recording': 'Ghi hình',
         'live_streaming': 'Phát trực tiếp',
         'night_vision': 'Chế độ ban đêm',
         'security_monitoring': 'Giám sát an ninh',
         'alert_system': 'Hệ thống cảnh báo'
       };

      return Object.keys(capabilities)
        .filter(key => capabilities[key] === true || capabilities[key] === 1)
        .map(key => capabilityLabels[key] || key)
        .filter(label => label);
    } catch (error) {
      console.warn('Error parsing device capabilities:', error);
      return [];
    }
  };

  const fetchDevice = async () => {
    try {
      setIsLoading(true);
      
      // Gọi song song cả hai API để lấy owned devices và shared devices
      // Sử dụng API with-components để lấy đầy đủ thông tin device_type_id và capabilities
      const [ownedDevicesResponse, sharedDevicesResponse] = await Promise.allSettled([
        axiosPublic.get(`devices/account/with-components`),
        deviceApi.getSharedDevices({ search: '' })
      ]);

      let allDevices = [];

      // Xử lý owned devices
      if (ownedDevicesResponse.status === 'fulfilled') {
        const ownedDevices = Array.isArray(ownedDevicesResponse.value) ? ownedDevicesResponse.value : [];
        // Đánh dấu ownership = 'mine' cho devices của user
        const ownedDevicesWithOwnership = ownedDevices.map(device => ({
          ...device,
          ownership: 'mine',
          // Enhanced type detection using device_type_id and capabilities
          type: getDeviceTypeFromCategory(
            device.device_type_id, 
            device.device_type_name,
            device.device_type_parent_name,
            device.device_base_capabilities
          )
        }));
        allDevices = [...allDevices, ...ownedDevicesWithOwnership];
      } else {
        console.error("Error fetching owned devices:", ownedDevicesResponse.reason);
        toast.error("Không thể tải thiết bị của bạn. Vui lòng thử lại.");
      }

      // Xử lý shared devices  
      if (sharedDevicesResponse.status === 'fulfilled') {
        const sharedDevicesData = sharedDevicesResponse.value?.data || sharedDevicesResponse.value;
        const sharedDevices = Array.isArray(sharedDevicesData) ? sharedDevicesData : [];
        
        console.log('🔍 Raw shared devices response:', sharedDevicesResponse.value);
        console.log('🔍 Extracted shared devices data:', sharedDevices);
        
        // Đánh dấu ownership = 'shared' cho devices được chia sẻ
        const sharedDevicesWithOwnership = sharedDevices.map(device => {
          console.log('🔍 Processing shared device:', device);
          
          const mappedDevice = {
            ...device,
            ownership: 'shared',
            // Map các field từ shared device response về format chuẩn dựa trên API response thực tế
            name: device.device_name || device.name || 'Unknown Device',
            id: device.device_id || device.id || device.permission_id, // Fallback to permission_id if no device_id
            serial_number: device.device_serial || device.serial_number,
            // Enhanced type detection using device_type_id
            type: getDeviceTypeFromCategory(
              device.device_type_id,
              device.device_type_name || device.category_name,
              device.device_type_parent_name,
              device.device_base_capabilities
            ),
            // Thêm các field cần thiết với giá trị mặc định
            power_status: device.power_status ?? true, // Default to true if not provided
            status: device.status || 'active',
            group: device.group || 0, // Default group for filter compatibility
            house: device.house || 0, // Default house for filter compatibility
            group_name: device.group_name || '', // Không hiển thị group name mặc định cho shared device
            room: device.room || 'Shared Room',
            device_type_parent_name: device.template_device_name || device.category_name || 'Unknown',
            device_type_parent_image: device.device_type_parent_image || '/img/default-device.png',
            // Copy device type info
            device_type_id: device.device_type_id,
            device_type_name: device.device_type_name || device.category_name,
            device_base_capabilities: device.device_base_capabilities,
            // Thông tin về permission type
            permission_type: device.permission_type
          };
          
          console.log('🔍 Mapped shared device:', mappedDevice);
          return mappedDevice;
        });
        
        console.log('🔍 All shared devices after mapping:', sharedDevicesWithOwnership);
        allDevices = [...allDevices, ...sharedDevicesWithOwnership];
      } else {
        console.error("Error fetching shared devices:", sharedDevicesResponse.reason);
        toast.error("Không thể tải thiết bị được chia sẻ. Vui lòng thử lại.");
      }

      console.log('🔍 Final allDevices:', allDevices);
      setDevices(allDevices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi tải danh sách thiết bị. Vui lòng thử lại.");
      setDevices([]); // Set to empty array on error to prevent filter issues
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("👤 User authenticated, ready for device-specific connections:", user.id || user.account_id);
      console.log("💡 Global socket connection disabled - devices will connect individually");
    }
  }, [user]);

  useEffect(() => {
    if (emergencyAlerts.length > 0) {
      emergencyAlerts.forEach((alert) => {
        console.log("🚨 EMERGENCY ALERT:", alert);
        toast.error(`Cảnh báo khẩn cấp: ${alert.message}`);
      });
    }
  }, [emergencyAlerts, dismissEmergencyAlert]);

  useEffect(() => {
    if (selectedDevice && user && isConnected && enableRealTime) {
      console.log("🔴 Starting real-time monitoring for:", selectedDevice.serial_number);
      connectToDevice(selectedDevice.serial_number, user.id || user.account_id);
    }

    return () => {
      if (selectedDevice && enableRealTime) {
        console.log("🔵 Stopping real-time monitoring for:", selectedDevice.serial_number);
        disconnectFromDevice(selectedDevice.serial_number);
      }
    };
  }, [selectedDevice, user, isConnected, enableRealTime, connectToDevice, disconnectFromDevice]);

  const handleDeviceClick = (device) => {
    console.log("handleDeviceClick called with:", device);
    setSelectedDevice(device);
  };

  const handleBackClick = () => {
    if (selectedDevice) {
      setSelectedDevice(null);
    } else {
      onBack();
    }
  };

  const handleToggle = (e, deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    
    // Kiểm tra quyền: chỉ cho phép toggle nếu là thiết bị của mình hoặc shared device có quyền CONTROL
    if (device?.ownership === "shared" && device?.permission_type === 'VIEW') {
      toast.error("Bạn chỉ có quyền xem thiết bị này, không thể điều khiển.");
      return;
    }

    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, power_status: !device.power_status, status: !device.power_status ? "active" : "inactive" }
          : device,
      ),
    );
    
    // Sync selectedDevice if it matches the toggled device
    if (selectedDevice && selectedDevice.id === deviceId) {
      setSelectedDevice((prev) => ({
        ...prev,
        power_status: !prev.power_status,
        status: !prev.power_status ? "active" : "inactive",
      }));
    }
  };

  const handleDeleteDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    
    // Chỉ cho phép xóa thiết bị của mình
    if (device?.ownership === "shared") {
      toast.error("Bạn không thể xóa thiết bị được chia sẻ.");
      return;
    }

    setDevices(devices.filter((device) => device.id !== deviceId));
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null);
    }
  };

  const handleEditDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    
    // Kiểm tra quyền: chỉ cho phép edit nếu là thiết bị của mình hoặc shared device có quyền CONTROL
    if (device?.ownership === "shared" && device?.permission_type === 'VIEW') {
      toast.error("Bạn chỉ có quyền xem thiết bị này, không thể chỉnh sửa.");
      return;
    }

    alert(`Chỉnh sửa thiết bị ID: ${deviceId}`);
  };

  const handleUnlinkSharedDevice = async (device) => {
    if (device.ownership !== "shared") return;
    try {
      // Gọi API unlink
      await deviceApi.unlinkSharedDevice(device.serial_number);
      toast.success("Đã gỡ thiết bị được chia sẻ thành công!");
      setDevices(devices.filter((d) => d.id !== device.id));
      if (selectedDevice?.id === device.id) setSelectedDevice(null);
    } catch (err) {
      toast.error("Gỡ thiết bị thất bại: " + (err?.message || "Lỗi không xác định"));
    }
  };

  const getDeviceIcon = (type) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case "camera":
        return <Camera {...iconProps} />;
      case "light":
        return <Lightbulb {...iconProps} />;
      case "led-rgb":
        return <Zap {...iconProps} />;
      case "led-white":
      case "led-single":
        return <Lightbulb {...iconProps} />;
      case "smoke":
      case "sensor-smoke-fire":
        return <Flame {...iconProps} />;
      case "temperature":
        return <Thermometer {...iconProps} />;
      case "gas-sensor":
        return <Wind {...iconProps} />;
      case "sensor":
        return <Thermometer {...iconProps} />;
      case "door":
      case "door-roller":
      case "door-sliding":
      case "door-swing":
        return <DoorOpen {...iconProps} />;
      case "pump":
        return <Droplets {...iconProps} />;
      case "hub":
      case "hub-door":
        return <Wifi {...iconProps} />;
      case "controller":
        return <Settings {...iconProps} />;
      case "security":
        return <Shield {...iconProps} />;
      default:
        return <Smartphone {...iconProps} />;
    }
  };

  const getDeviceColor = (type) => {
    switch (type) {
      case "camera":
        return "from-blue-500 to-blue-600";
      case "light":
        return "from-amber-500 to-amber-600";
      case "led-rgb":
        return "from-purple-500 to-pink-600";
      case "led-white":
        return "from-amber-400 to-yellow-500";
      case "led-single":
        return "from-amber-500 to-amber-600";
      case "smoke":
      case "sensor-smoke-fire":
        return "from-red-500 to-red-600";
      case "temperature":
        return "from-blue-500 to-blue-600";
      case "gas-sensor":
        return "from-green-500 to-teal-600";
      case "sensor":
        return "from-blue-500 to-blue-600";
      case "door":
      case "door-roller":
      case "door-sliding":
      case "door-swing":
        return "from-green-500 to-green-600";
      case "pump":
        return "from-cyan-500 to-cyan-600";
      case "hub":
      case "hub-door":
        return "from-indigo-500 to-indigo-600";
      case "controller":
        return "from-orange-500 to-orange-600";
      case "security":
        return "from-red-600 to-red-700";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getDeviceStatusColor = (status, power_status) => {
    if (!power_status) return "bg-gray-200 text-gray-700";
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSpaceIcon = (type) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case "living_room":
        return <Home {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name && device.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = filterOptions.group === 0 || (device.group !== undefined && device.group === filterOptions.group);
    const matchesHouse = filterOptions.house === 0 || (device.house !== undefined && device.house === filterOptions.house);
    const matchesStatus =
      filterOptions.status === "all" ||
      (filterOptions.status === "active" && device.power_status) ||
      (filterOptions.status === "inactive" && !device.power_status);

    // Debug shared devices filter
    if (device.ownership === 'shared') {
      console.log('🔍 Filtering shared device:', device.name, {
        matchesSearch,
        matchesGroup,
        matchesHouse,
        matchesStatus,
        device_group: device.group,
        device_house: device.house,
        filterOptions
      });
    }

    return matchesSearch && matchesGroup && matchesHouse && matchesStatus;
  });

  console.log('🔍 Filtered devices:', filteredDevices.length, 'of', devices.length);

  const devicesByOwnership = filteredDevices.reduce((acc, device) => {
    if (!acc[device.ownership]) {
      acc[device.ownership] = [];
    }
    acc[device.ownership].push(device);
    return acc;
  }, {});

  const myDevices = devicesByOwnership.mine || [];
  const sharedDevices = devicesByOwnership.shared || [];

  const activeDevices = devices.filter((device) => device.power_status).length;

  if (selectedDevice && selectedDevice.type === "camera") {
    return (
      <CameraControl
        camera={selectedDevice}
        onBack={() => setSelectedDevice(null)}
        onUpdateCamera={(updatedCamera) => {
          setDevices(devices.map((d) => (d.device_id === updatedCamera.device_id ? { ...d, ...updatedCamera } : d)));
          setSelectedDevice(updatedCamera);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleBackClick} className="rounded-full hover:bg-slate-100">
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div>
                  <h1
                    className={cn(
                      "font-semibold text-slate-900",
                      selectedDevice && selectedDevice.type !== "camera" ? "text-lg md:text-xl" : "text-xl",
                    )}
                  >
                    Danh sách thiết bị
                    <span
                      className={cn(
                        "ml-2 text-sm font-normal text-slate-500",
                        selectedDevice && selectedDevice.type !== "camera" && "hidden md:inline",
                      )}
                    >
                      {devices.length} thiết bị
                    </span>
                  </h1>
                  <div
                    className={cn(
                      "flex items-center space-x-2",
                      selectedDevice && selectedDevice.type !== "camera" && "hidden md:flex",
                    )}
                  >
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {activeDevices} đang hoạt động
                    </Badge>
                     {/* Emergency Alert Indicator */}
                    {emergencyAlerts.length > 0 && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {emergencyAlerts.length} cảnh báo khẩn cấp
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedDevice && (
                  <Button
                    onClick={() => setSelectedDevice(null)}
                    variant="outline"
                    className="border-slate-200 bg-red-500 text-white hover:bg-red-600"
                  >
                    Đóng chi tiết
                  </Button>
              )}
              {/* <Button onClick={handleAddDevice} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                <span>Thêm thiết bị</span>
              </Button> */}
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          <div
            className={cn(
              "bg-white transition-all duration-300 ease-in-out",
              selectedDevice && selectedDevice.type !== "camera"
                ? "w-full md:w-1/2 lg:w-2/5 border-r border-slate-200"
                : "w-full",
            )}
          >
            <div className="p-4">
              <div className="mb-6 space-y-4">
              <div className="relative flex items-center gap-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm thiết bị..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 border-slate-200"
                  />
                  <Button
                    onClick={() => {
                      navigate("/device-links");
                    }}
                    variant="outline"
                    className="border-slate-200 bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-900"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Sự kiện liên kết
                  </Button>
                </div>
              </div>

              <div className={cn("mb-6", selectedDevice && selectedDevice.type !== "camera" && "hidden lg:block")}>
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger
                      value="all"
                      className="bg-gray-100 hover:bg-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
                    >
                      Tất cả ({filteredDevices.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="shared"
                      className="bg-gray-100 hover:bg-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
                    >
                      Được chia sẻ ({sharedDevices.length})
                    </TabsTrigger>
                  </TabsList>

									<TabsContent value="all" className="mt-4">
										<DeviceGrid
											devices={filteredDevices}
											isLoading={isLoading}
											selectedDevice={selectedDevice}
											onDeviceClick={handleDeviceClick}
											onToggle={handleToggle}
											onEdit={handleEditDevice}
											onDelete={handleDeleteDevice}
											onUnlink={handleUnlinkSharedDevice}
											getDeviceIcon={getDeviceIcon}
											getDeviceColor={getDeviceColor}
											getDeviceStatusColor={getDeviceStatusColor}
											getDeviceTypeDisplayName={getDeviceTypeDisplayName}
											getDeviceCapabilities={getDeviceCapabilities}
											isCompact={selectedDevice && selectedDevice.type !== "camera"}
										/>
									</TabsContent>

									<TabsContent value="mine" className="mt-4">
										<DeviceGrid
											devices={myDevices}
											isLoading={isLoading}
											selectedDevice={selectedDevice}
											onDeviceClick={handleDeviceClick}
											onToggle={handleToggle}
											onEdit={handleEditDevice}
											onDelete={handleDeleteDevice}
											onUnlink={handleUnlinkSharedDevice}
											getDeviceIcon={getDeviceIcon}
											getDeviceColor={getDeviceColor}
											getDeviceStatusColor={getDeviceStatusColor}
											getDeviceTypeDisplayName={getDeviceTypeDisplayName}
											getDeviceCapabilities={getDeviceCapabilities}
											isCompact={selectedDevice && selectedDevice.type !== "camera"}
										/>
									</TabsContent>

									<TabsContent value="shared" className="mt-4">
										<DeviceGrid
											devices={sharedDevices}
											isLoading={isLoading}
											selectedDevice={selectedDevice}
											onDeviceClick={handleDeviceClick}
											onToggle={handleToggle}
											onEdit={handleEditDevice}
											onDelete={handleDeleteDevice}
											onUnlink={handleUnlinkSharedDevice}
											getDeviceIcon={getDeviceIcon}
											getDeviceColor={getDeviceColor}
											getDeviceStatusColor={getDeviceStatusColor}
											getDeviceTypeDisplayName={getDeviceTypeDisplayName}
											getDeviceCapabilities={getDeviceCapabilities}
											isCompact={selectedDevice && selectedDevice.type !== "camera"}
										/>
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>

          {selectedDevice && selectedDevice.type !== "camera" && (
            <div className="bg-white w-full md:w-1/2 lg:w-3/5 min-h-screen md:min-h-0">
              <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(selectedDevice.type)} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          {getDeviceIcon(selectedDevice.type)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{selectedDevice.name}</h2>
                          <p className="text-slate-500">{selectedDevice.room}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* <Switch
                          checked={selectedDevice.power_status}
                          onCheckedChange={(checked) => handleToggle(checked, selectedDevice.device_id)}
                          className="data-[state=checked]:bg-green-500"
                        /> */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDevice(selectedDevice.device_id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDevice(selectedDevice.device_id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa thiết bị
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUnlinkSharedDevice(selectedDevice)}
                              className="text-red-600"
                            >
                              <Unlink className="h-4 w-4 mr-2" />
                              Gỡ thiết bị được chia sẻ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Separator className="mb-6" />
                    {enableRealTime ? (
                      <RealTimeDeviceControl
                        key={selectedDevice.device_id}
                        device={selectedDevice}
                        accountId={user?.id || user?.account_id}
                      />
                    ) : (
                      <DynamicDeviceDetail
                        key={selectedDevice.device_id} // Force re-render when device changes
                        device={selectedDevice}
                      />
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}