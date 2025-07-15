import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
    Users,
    MoreVertical,
    UserMinus,
    Calendar,
    Mail,
    Eye,
    Settings,
    Clock,
    AlertTriangle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Separator } from '../../ui/separator';
import deviceApi from '../../../apis/modules/deviceApi';

const SharedUsersList = ({ device, onUpdateSharedUser, onRemoveSharedUser, refreshSharedUsers }) => {
    const [sharedUsers, setSharedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removeDialog, setRemoveDialog] = useState({ open: false, user: null });

    // Permission level icons and styles
    const permissionConfig = {
        'VIEW': {
            icon: Eye,
            label: 'Xem',
            color: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        'CONTROL': {
            icon: Settings,
            label: 'Điều khiển',
            color: 'bg-green-100 text-green-800 border-green-200'
        }
    };

    // Mock data - replace with real API call
    useEffect(() => {
        fetchSharedUsers();
    }, [device?.serial_number, refreshSharedUsers]);

    const fetchSharedUsers = async () => {
        setLoading(true);
        try {
            const response = await deviceApi.getSharedUsers(device.serial_number);
            console.log("📋 Shared users API response:", response);

            if (response && response.data && Array.isArray(response.data)) {
                // Map API response to component format
                const formattedUsers = response.data.map(user => ({
                    id: user.permission_id,
                    user_id: user.shared_with_user_id,
                    email: user.customer_email,
                    name: user.customer_name,
                    avatar: user.customer_image,
                    permission_level: user.permission_type, // 'VIEW' or 'CONTROL'
                    shared_at: user.created_at,
                    expires_at: null, // Set if you have expiry data
                    last_accessed: user.updated_at,
                    is_active: !user.is_deleted,
                    shared_by: 'Hệ thống',
                    // Keep original data for potential use
                    customer_name: user.customer_name,
                    customer_email: user.customer_email,
                    customer_image: user.customer_image
                }));

                console.log("✅ Formatted shared users:", formattedUsers);
                setSharedUsers(formattedUsers);
            } else {
                console.log("ℹ️ No shared users data received");
                setSharedUsers([]);
            }
        } catch (error) {
            console.error('❌ Failed to fetch shared users:', error);
            setSharedUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (user) => {
        try {
            await onRemoveSharedUser?.(device.id, user.user_id);
            setSharedUsers(prev => prev.filter(u => u.id !== user.id));
            setRemoveDialog({ open: false, user: null });
            console.log(`Removed user ${user.email} from device`);
        } catch (error) {
            console.error('Failed to remove user:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Không có';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isExpired = (expiresAt) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    const isExpiringSoon = (expiresAt) => {
        if (!expiresAt) return false;
        const expiryDate = new Date(expiresAt);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        return expiryDate < threeDaysFromNow && expiryDate > new Date();
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Người dùng được chia sẻ
                        </div>
                        <div className="animate-pulse bg-slate-200 h-6 w-16 rounded-full"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-3">
                                <div className="animate-pulse bg-slate-200 w-10 h-10 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="animate-pulse bg-slate-200 h-4 w-32 rounded"></div>
                                    <div className="animate-pulse bg-slate-200 h-3 w-48 rounded"></div>
                                    <div className="animate-pulse bg-slate-200 h-3 w-24 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Người dùng được chia sẻ
                        </div>
                        <Badge variant="secondary">
                            {sharedUsers.length} người
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    {sharedUsers.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Chưa có ai được chia sẻ quyền truy cập thiết bị này</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sharedUsers.map((user, index) => {
                                const PermissionIcon = permissionConfig[user.permission_level]?.icon || Settings;
                                const isUserExpired = isExpired(user.expires_at);
                                const isUserExpiringSoon = isExpiringSoon(user.expires_at);

                                return (
                                    <div key={user.id}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={user.customer_image || user.avatar} />
                                                    <AvatarFallback className="bg-slate-200">
                                                        {getInitials(user.customer_name || user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <p className="font-medium text-sm truncate">
                                                            {user.customer_name || user.name}
                                                        </p>
                                                        {isUserExpired && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Hết hạn
                                                            </Badge>
                                                        )}
                                                        {isUserExpiringSoon && (
                                                            <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                                                                Sắp hết hạn
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-600 mb-2 flex items-center">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {user.customer_email || user.email}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                        {permissionConfig[user.permission_level] && (
                                                            <Badge
                                                                variant="outline"
                                                                className={`${permissionConfig[user.permission_level].color} text-xs`}
                                                            >
                                                                <PermissionIcon className="w-3 h-3 mr-1" />
                                                                {permissionConfig[user.permission_level].label}
                                                            </Badge>
                                                        )}

                                                        <span className="flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {formatDate(user.shared_at)}
                                                        </span>
                                                    </div>

                                                    {user.expires_at && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Hết hạn: {formatDate(user.expires_at)}
                                                        </p>
                                                    )}

                                                    {user.last_accessed && (
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Truy cập cuối: {formatDate(user.last_accessed)}
                                                        </p>
                                                    )}

                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Chia sẻ bởi: {user.shared_by}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => setRemoveDialog({ open: true, user })}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <UserMinus className="w-4 h-4 mr-2" />
                                                        Xoá quyền truy cập
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {index < sharedUsers.length - 1 && (
                                            <Separator className="mt-4" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Remove User Confirmation Dialog */}
            <AlertDialog
                open={removeDialog.open}
                onOpenChange={(open) => setRemoveDialog({ open, user: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                            Xác nhận xoá quyền truy cập
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xoá quyền truy cập thiết bị của{' '}
                            <strong>{removeDialog.user?.name}</strong> ({removeDialog.user?.email})?
                            <br /><br />
                            Người này sẽ không thể truy cập hoặc điều khiển thiết bị nữa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleRemoveUser(removeDialog.user)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xoá quyền
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SharedUsersList; 