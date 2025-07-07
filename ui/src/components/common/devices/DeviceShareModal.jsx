import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { 
    Share2, 
    UserPlus, 
    Mail,
    Calendar,
    Settings,
    X,
    AlertCircle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Switch } from '../../ui/switch';
import { Alert, AlertDescription } from "../../ui/alert";
import deviceApi from '../../../apis/modules/deviceApi';

const DeviceShareModal = ({ device, onShareDevice, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shareData, setShareData] = useState({
        username: '',
        permission_level: 'VIEW',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');

    const permissionLevels = {
        'VIEW': {
            label: 'Xem',
            description: 'Chỉ có thể xem trạng thái thiết bị',
            color: 'bg-blue-100 text-blue-800'
        },
        'CONTROL': {
            label: 'Điều khiển',
            description: 'Có thể xem và điều khiển thiết bị',
            color: 'bg-green-100 text-green-800'
        }
    };

    // Search users by username or email
    const searchUsers = async (query) => {
        if (!query || query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setError('');
        try {
            // Search by username or email
            const searchParams = {
                username: query.includes('@') ? undefined : query,
                email: query.includes('@') ? query : undefined
            };
            
            const response = await deviceApi.searchUser(searchParams);
            
            if (response && response.data && response.data.customer) {
                // Format search result to match our component structure
                const user = {
                    account_id: response.data.account.account_id,
                    username: response.data.account.username,
                    email: response.data.customer.email,
                    name: response.data.customer.full_name,
                    avatar: response.data.customer.avatar
                };
                setSearchResults([user]);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Failed to search users:', error);
            setError('Không tìm thấy người dùng');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search input change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers(shareData.username);
        }, 500);

        return () => clearTimeout(timer);
    }, [shareData.username]);

    const handleShare = async () => {
        if (!selectedUser) {
            setError('Vui lòng chọn người dùng để chia sẻ');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const ticketData = {
                device_serial: device.serial_number,
                ticket_type_id: 3, // SHARE_PERMISSION
                assigned_to: selectedUser.username,
                description: shareData.permission_level // 'VIEW' or 'CONTROL'
            };

            const response = await deviceApi.createSharePermissionTicket(ticketData);
            
            if (response && response.data) {
                setIsOpen(false);
                resetForm();
                
                // Call parent callback if provided
                await onShareDevice?.(device, selectedUser, shareData.permission_level);
                
                console.log('Share permission request sent successfully');
            }
        } catch (error) {
            console.error('Failed to create share permission request:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi chia sẻ thiết bị');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setShareData({
            username: '',
            permission_level: 'VIEW',
            message: ''
        });
        setSearchResults([]);
        setSelectedUser(null);
        setError('');
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setShareData(prev => ({ ...prev, username: user.username }));
        setSearchResults([]);
    };

    const removeSelectedUser = () => {
        setSelectedUser(null);
        setShareData(prev => ({ ...prev, username: '' }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ thiết bị
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Share2 className="w-5 h-5 mr-2" />
                        Chia sẻ thiết bị: {device?.device_name || device?.name}
                    </DialogTitle>
                    <DialogDescription>
                        Gửi yêu cầu chia sẻ quyền truy cập thiết bị. Người nhận sẽ cần chấp nhận yêu cầu trước khi có thể truy cập thiết bị.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Username/Email Input with Search */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Tài khoản người dùng
                        </Label>
                        <div className="relative">
                            <Input
                                id="username"
                                placeholder="Nhập username hoặc email..."
                                value={shareData.username}
                                onChange={(e) => setShareData(prev => ({ ...prev, username: e.target.value }))}
                                className="pr-10"
                            />
                            {shareData.username && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1 h-6 w-6 p-0"
                                    onClick={removeSelectedUser}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                            {isSearching && (
                                <div className="absolute right-3 top-3">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="border rounded-md bg-white shadow-sm max-h-32 overflow-y-auto">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.account_id}
                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-b-0"
                                        onClick={() => selectUser(user)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                                <UserPlus className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-slate-600">@{user.username}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Selected User Display */}
                        {selectedUser && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                                        <UserPlus className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-blue-900">{selectedUser.name}</p>
                                        <p className="text-xs text-blue-700">@{selectedUser.username}</p>
                                        <p className="text-xs text-blue-600">{selectedUser.email}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                        onClick={removeSelectedUser}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Permission Level */}
                    <div className="space-y-2">
                        <Label className="flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Mức quyền truy cập
                        </Label>
                        <Select
                            value={shareData.permission_level}
                            onValueChange={(value) => setShareData(prev => ({ ...prev, permission_level: value }))}
                            
                        >
                            <SelectTrigger  >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent >
                                {Object.entries(permissionLevels).map(([key, permission]) => (
                                    <SelectItem key={key} value={key} className="bg-white">
                                        <div className="flex items-center space-x-2">
                                            <Badge className={permission.color} variant="secondary">
                                                {permission.label}
                                            </Badge>
                                            <span className="text-sm">{permission.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
                        <Textarea
                            id="message"
                            placeholder="Thêm lời nhắn cho người nhận..."
                            value={shareData.message}
                            onChange={(e) => setShareData(prev => ({ ...prev, message: e.target.value }))}
                            rows={3}
                        />
                    </div>

                    {/* Share Preview */}
                    {selectedUser && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Tóm tắt chia sẻ</h4>
                            <div className="space-y-1 text-sm">
                                <p><strong>Người nhận:</strong> {selectedUser.name} (@{selectedUser.username})</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Quyền:</strong> {permissionLevels[shareData.permission_level].label}</p>
                                <p><strong>Thiết bị:</strong> {device?.device_name || device?.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsOpen(false);
                            resetForm();
                        }}
                    >
                        Huỷ bỏ
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={!selectedUser || isLoading}
                        className="min-w-[100px]"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang gửi...
                            </div>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4 mr-2" />
                                Gửi yêu cầu
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeviceShareModal; 