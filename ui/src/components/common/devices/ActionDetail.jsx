import { Share, CloudOff, Lock, RotateCcw, SendToBack, FileStack, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function ActionDetail( {lock, disconnect, share, reset, transfer, version, alert} ) {
    const [action, setAction] = useState([
        {id: 1, name: "Khoá thiết bị", icon: <Lock className="inline"/>, onClick: lock},
        {id: 2, name: "Gỡ kết nối", icon: <CloudOff className="inline"/>, onClick: disconnect},
        {id: 3, name: "Chia sẻ quyền", icon: <Share className="inline"/>, onClick: share},
        {id: 4, name: "Reset thiết bị", icon: <RotateCcw className="inline"/>, onClick: reset},
        {id: 5, name: "Chuyển quyền sở hữu", icon: <SendToBack className="inline"/>, onClick: transfer},
        {id: 6, name: "Xem phiên bản", icon: <FileStack className="inline"/>, onClick: version},
    ])
    return (
        <>
        <div className="grid grid-cols-2 gap-3 mb-3">
            {action.map((item) => (
                <button key={item.id} className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600" onClick={item.onClick}>
                    {item.icon} {item.name}
                </button>
            ))}
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-red-700 mb-3" onClick={alert}>
            <AlertCircle className="inline"/> Báo mất thiết bị
        </button>
        </>
    )
}