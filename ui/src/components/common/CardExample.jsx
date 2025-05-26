"use client"
import FlexibleCard from "./FlexibleCard"
import { Home, User } from "lucide-react"

const CardExamples = () => {
    return (
        <div className="space-y-4 p-4 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Các loại Thẻ sử dụng</h2>

            <FlexibleCard
                title="Main house"
                subtitle="Smart home"
                type="location"
                icon={<Home size={40} />}
                mode="linkable"
                onClick={() => alert("Chuyển trang | Mở modal!")}
            />

            <FlexibleCard
                title="User A - không action"
                icon={<User size={48} className="text-blue-500" />}
                iconSize={48}
            />

            <FlexibleCard
                title="User A"
                selected={true}
                mode="selectable"
                onEdit={() => alert("Sửa user A")}
            />

            <FlexibleCard
                title="User A"
                subtitle="Vai trò - quyền"
                mode="deletable"
                onRemove={() => alert("Xoá user A")}
            />

            <FlexibleCard
                title="User A"
                subtitle="Vai trò - quyền"
                mode="editable"
                onEdit={() => alert("Sửa user A")}
            />

            <FlexibleCard
                title="User A"
                subtitle="Xoá và sửa"
                mode="edit-delete"
                onRemove={() => alert("Xoá user A")}
                onEdit={() => alert("Sửa user A")}
            />


            <FlexibleCard
                title="Đèn phòng khách"
                subtitle="Thiết bị thông minh"
                mode="toggle"
                selected={true}
                onEdit={() => alert("Sửa đèn phòng khách")}
            />

        </div>
    )
}

export default CardExamples
