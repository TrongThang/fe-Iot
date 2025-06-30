"use client"

import { useEffect, useState } from "react"
import axiosPublic from "@/apis/clients/public.client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Smartphone,
    Monitor,
    Tablet,
    Laptop,
    LogOut,
    Activity,
    Globe,
    Calendar,
    User,
    Clock
} from "lucide-react"
import Swal from "sweetalert2"

function getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return { Authorization: `Bearer ${token}` };
}

const fetchUserDevices = async () => {
    return await axiosPublic.get("/user-devices/me", { headers: getAuthHeaders() });
};

const fetchSyncTracking = async () => {
    return await axiosPublic.get("/sync-tracking/me", { headers: getAuthHeaders() });
};

const logoutDevice = async (userDeviceId) => {
    return await axiosPublic.post(
        "/auth/logout",
        { userDeviceId },
        { headers: getAuthHeaders() }
    );
};

const logoutAllDevices = async (userDeviceIds) => {
    return await axiosPublic.post(
        "/auth/logout/multiple",
        { userDeviceIds },
        { headers: getAuthHeaders() }
    );
};

export default function UserActivity() {
    const [sessions, setSessions] = useState([]);
    const [syncLogs, setSyncLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy device_id hiện tại từ localStorage
    const currentDeviceId = localStorage.getItem("device_id");

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [devices, syncs] = await Promise.all([
                    fetchUserDevices(),
                    fetchSyncTracking(),
                ]);
                setSessions(devices);
                setSyncLogs(syncs);
            } catch (err) {
                // Xử lý lỗi 
            }
            setLoading(false);
        }
        loadData();
        // expose loadData for later use
        UserActivity.loadData = loadData;
    }, []);

    // Hàm xác định icon thiết bị (có thể mở rộng nếu backend trả về loại thiết bị)
    const getDeviceIcon = (deviceName) => {
        if (!deviceName) return Monitor;
        const name = deviceName.toLowerCase();
        if (name.includes("android")) return Smartphone;
        if (name.includes("iphone") || name.includes("ios")) return Smartphone;
        if (name.includes("windows") || name.includes("mozilla")) return Laptop;
        if (name.includes("macbook") || name.includes("macos")) return Laptop;
        if (name.includes("tablet")) return Tablet;
        return Monitor;
    };

    const terminateSession = async (userDeviceId) => {
        try {
            await logoutDevice(userDeviceId);
            if (typeof UserActivity.loadData === 'function') {
                await UserActivity.loadData();
            }
            Swal.fire({
                icon: "success",
                title: "Đăng xuất thành công",
                text: "Thiết bị đã được đăng xuất.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            let message = "Có lỗi xảy ra!";
            if (typeof err === "string") {
                message = err;
            } else if (err && err.message) {
                message = err.message;
            } else if (err instanceof XMLHttpRequest) {
                message = "Không nhận được phản hồi từ server";
            }
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: message,
            });
        }
    };

    const terminateAllSessions = async () => {
        const allUserDeviceIds = sessions.map(s => s.user_device_id);
        const currentUserDeviceId = sessions.find(s => s.device_id === currentDeviceId)?.user_device_id;
        const idsToLogout = allUserDeviceIds.filter(id => id !== currentUserDeviceId);

        if (idsToLogout.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Không có thiết bị nào để đăng xuất",
                text: "Chỉ còn thiết bị hiện tại.",
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        try {
            await logoutAllDevices(idsToLogout);
            setSessions(sessions.filter((session) => session.user_device_id === currentUserDeviceId));
            Swal.fire({
                icon: "success",
                title: "Đăng xuất tất cả thành công",
                text: "Tất cả thiết bị đã được đăng xuất (trừ thiết bị hiện tại).",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            let message = "Có lỗi xảy ra!";
            if (typeof err === "string") {
                message = err;
            } else if (err && err.message) {
                message = err.message;
            } else if (err instanceof XMLHttpRequest) {
                message = "Không nhận được phản hồi từ server";
            }
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: message,
            });
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        return new Date(dateTime).toLocaleString("vi-VN");
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Hoạt động người dùng</h1>
                <p className="text-muted-foreground text-xl">Theo dõi tình trạng đăng nhập trên nhiều thiết bị</p>
            </div>

            <Tabs defaultValue="sessions" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sessions" className="flex items-center gap-2 py-2">
                        <Activity className="w-4 h-4" />
                        Phiên đăng nhập
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Lịch sử đồng bộ
                    </TabsTrigger>
                </TabsList>

                {/* Phiên đăng nhập */}
                <TabsContent value="sessions" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Phiên đăng nhập hiện tại</h2>
                            <p className="text-sm text-muted-foreground">{sessions.length} thiết bị đang đăng nhập</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Đăng xuất tất cả
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Đăng xuất tất cả thiết bị?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Hành động này sẽ đăng xuất khỏi tất cả thiết bị trừ thiết bị hiện tại. Bạn sẽ cần đăng nhập lại trên các thiết bị khác.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction onClick={terminateAllSessions} className="bg-red-600 hover:bg-red-700">
                                        Đăng xuất tất cả
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div className="grid gap-4">
                        {sessions.map((session) => {
                            const isCurrent = session.device_id === currentDeviceId;
                            const DeviceIcon = getDeviceIcon(session.device_name);
                            return (
                                <Card
                                    key={session.user_device_id}
                                    className={
                                        "transition-all duration-200 " +
                                        (isCurrent
                                            ? "ring-2 ring-blue-500 bg-blue-50/70 shadow-lg"
                                            : "hover:ring-1 hover:ring-gray-300 bg-white")
                                    }
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 shadow">
                                                    <DeviceIcon className="w-7 h-7 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-lg text-blue-700">{session.device_name}</h3>
                                                        {isCurrent && (
                                                            <Badge variant="default" className="text-xs bg-blue-600 text-white border-blue-600">
                                                                Thiết bị hiện tại
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 mt-1 text-sm">
                                                        <span className="flex items-center gap-1 text-gray-600 font-medium">
                                                            <Globe className="w-4 h-4 text-blue-400" />
                                                            <span className="text-blue-800">{session.device_id}</span>
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-600">
                                                            <Calendar className="w-4 h-4 text-green-500" />
                                                            <span className="font-semibold text-green-700">Thêm:</span> {formatDateTime(session.created_at)}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-600">
                                                            <Clock className="w-4 h-4 text-yellow-500" />
                                                            <span className="font-semibold text-yellow-700">Cập nhật:</span> {formatDateTime(session.updated_at)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 mt-1 text-sm">
                                                        <span className="flex items-center gap-1 text-gray-600">
                                                            <Clock className="w-4 h-4 text-green-600" />
                                                            <span className="font-semibold text-green-700">Đăng nhập:</span> {formatDateTime(session.last_login)}
                                                        </span>
                                                        {session.last_out && (
                                                            <span className="flex items-center gap-1 text-gray-600">
                                                                <Clock className="w-4 h-4 text-red-500" />
                                                                <span className="font-semibold text-red-700">Đăng xuất:</span> {formatDateTime(session.last_out)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {!isCurrent && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            <LogOut className="w-4 h-4 mr-2" />
                                                            Đăng xuất
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Đăng xuất thiết bị?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc chắn muốn đăng xuất khỏi {session.device_name}? Thiết bị này sẽ cần đăng nhập lại để truy cập tài khoản.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => terminateSession(session.user_device_id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Đăng xuất
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>

                {/* Lịch sử đồng bộ */}
                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Lịch sử đồng bộ
                            </CardTitle>
                            <CardDescription>Theo dõi các hoạt động đồng bộ thiết bị gần đây</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {syncLogs.length === 0 && <div>Không có dữ liệu</div>}
                                {syncLogs.map((log, index) => (
                                    <div key={log.deviceInfo.deviceUuid + log.lastSyncedAt}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{log.deviceInfo.deviceName}</span>
                                                    <Badge
                                                        variant={log.syncType === "login" ? "default" : "secondary"}
                                                        className={log.syncType === "login" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
                                                    >
                                                        {log.syncType === "login" ? "Đăng nhập" : "Đăng xuất"}
                                                    </Badge>
                                                    <Badge
                                                        variant={log.syncStatus === "success" ? "default" : "destructive"}
                                                        className={log.syncStatus === "success" ? "bg-blue-500 text-white" : "bg-red-500 text-white"}
                                                    >
                                                        {log.syncStatus === "success" ? "Thành công" : "Thất bại"}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Globe className="w-3 h-3" />
                                                        {log.ipAddress}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDateTime(log.lastSyncedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {index < syncLogs.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
