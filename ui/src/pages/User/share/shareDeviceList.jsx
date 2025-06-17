import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft,  User } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import DeviceSharingDialog from "./shareDeviceDialog"

export default function DeviceSharingList() {
    const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const sharedUsers = [
        {
            id: 1,
            name: "User A",
            email: "Email",
            shareDate: "01/01/2000",
        },
        {
            id: 2,
            name: "User A",
            email: "Email",
            shareDate: "01/01/2000",
        },
    ]
    return (
        <div className="">
            {/* Header */}
            <div className=" text-white p-4 rounded-b-lg flex items-center ">
                <span className="pe-5">
                    <ArrowLeft className="w-5 h-5 cursor-pointer text-black" onClick={() => window.history.back()} />
                </span>
                <h1 className="font-bold text-black ">Danh sách chia sẻ thiết bị</h1>
            </div>

            {/* User List */}
            <div className="p-4 space-y-3">
                {sharedUsers.map((user) => (
                    <Card key={user.id} className="bg-white shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <Avatar className="w-10 h-10 bg-gray-400">
                                    <AvatarFallback className="bg-gray-400 text-white">
                                        <User className="w-5 h-5" />
                                    </AvatarFallback>
                                </Avatar>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="space-y-1 mb-3">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-sm text-gray-600">Ngày chia sẻ: {user.shareDate}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" size="sm">
                                            Gỡ quyền
                                        </Button>
                                        <Button onClick={() => setIsSharingDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" size="sm">
                                            Sửa quyền
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DeviceSharingDialog deviceId={sharedUsers} onClose={() => setIsSharingDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
