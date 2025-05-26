"use client"
import { Trash2, Edit, Users } from "lucide-react"

/**
 * FamilyCard Component
 *
 * @param {Object} props
 * @param {string} props.familyName - Name of the family/group (e.g. "Family A")
 * @param {number} props.memberCount - Number of members (e.g. 5)
 * @param {string} [props.type] - Type of group (e.g. "Work", "Family")
 * @param {string} [props.variant="detailed"] - Layout variant: "detailed" or "simple"
 * @param {boolean} [props.showActions] - Whether to show action buttons (delete/edit)
 * @param {string} [props.deleteText="Xoá"] - Text for delete button
 * @param {string} [props.editText="Sửa"] - Text for edit button
 * @param {function} [props.onDelete] - Callback for delete action
 * @param {function} [props.onEdit] - Callback for edit action
 * @param {function} [props.onClick] - Callback for card click
 * @param {string} [props.className] - Additional CSS classes
 */
const GroupCard = ({
    familyName,
    memberCount,
    type,
    variant = "detailed",
    showActions = false,
    deleteText = "Xoá",
    editText = "Sửa",
    onDelete,
    onEdit,
    onClick,
    className = "",
    ...props
}) => {
    const renderGroupIcon = () => (
        <div className="flex items-center justify-center">
            <Users />
        </div>
    )

    if (variant === "simple") {
        return (
            <div
                className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}
                onClick={onClick}
                role={onClick ? "button" : ""}
                tabIndex={onClick ? 0 : undefined}
                {...props}
            >
                {renderGroupIcon()}
                <h3 className="font-semibold text-lg mt-2">{familyName}</h3>
                <p className="text-sm text-gray-600"><span className="w-2 h-2 bg-yellow-500 rounded">{memberCount}</span> thành viên</p>
                {type && (
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Loại: {type}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            className={`bg-gray-100 rounded-lg p-4 flex items-center justify-between ${className}`}
            onClick={onClick}
            role={onClick ? "button" : ""}
            tabIndex={onClick ? 0 : undefined}
            {...props}
        >
            <div className="flex items-center gap-3">
                {renderGroupIcon()}
                <div>
                    <h3 className="font-semibold text-lg">{familyName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            {memberCount} Thành viên
                        </span>
                    </div>
                    {type && <div className="text-xs text-gray-500 mt-1">Loại: {type}</div>}
                </div>
            </div>

            {showActions && (
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit && onEdit()
                        }}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Edit size={25} />
                        {editText}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete && onDelete()
                        }}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={25} />
                        {deleteText}
                    </button>
                </div>
            )}
        </div>
    )
}

export default GroupCard
