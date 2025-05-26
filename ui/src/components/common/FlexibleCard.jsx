"use client"
import { ChevronRight, Trash2, FileText, House, Edit } from "lucide-react"
import { Switch, SwitchCustom } from "@/components/ui/switchCustom"
import { Label } from "@/components/ui/label"
import { useState } from "react"
/**
 * FlexibleCard Component
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {string} [props.type="user"]
 * @param {boolean} [props.selected]
 * @param {boolean} [props.showActions]
 * @param {string} [props.removeText="Gỡ"]
 * @param {string} [props.editText="Sửa"]
 * @param {function} [props.onRemove]
 * @param {function} [props.onEdit]
 * @param {function} [props.onClick]
 * @param {React.ReactNode} [props.icon] - Custom icon component
 * @param {number} [props.iconSize=40] - Icon size
 */
/**
 * @param {"selectable" | "deletable"} [props.mode]
 */
const FlexibleCard = ({
    title,
    subtitle,
    type = "user",
    selected = false,
    showActions = false,
    removeText = "Gỡ",
    editText = "Sửa",
    onRemove,
    onEdit,
    onClick,
    icon,
    iconSize = 40,
    mode = "", // <-- thêm mode
    className = "",
    ...props
}) => {
    const renderIcon = () => {
        if (icon) return <div className="text-gray-700">{icon}</div>

        switch (type) {
            case "location":
                return <div className="text-gray-700"><House size={iconSize} /></div>
            case "user":
            default:
                return (
                    <div
                        className="flex items-center justify-center rounded-full bg-gray-800 text-white"
                        style={{ width: iconSize, height: iconSize }}
                    />
                )
        }
    }

    const handleRemove = (e) => {
        e.stopPropagation()
        onRemove?.()
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        onEdit?.()
    }

    const [isOn, setIsOn] = useState(true);

    return (
        <div
            className={`flex items-center justify-between p-3 bg-gray-100 rounded-md ${className} hover:text-blue-600 hover:bg-blue-100`}
            onClick={onClick}
            role={onClick ? "button" : ""}
            tabIndex={onClick ? 0 : undefined}
            {...props}
        >
            <div className="flex items-center gap-2">
                {renderIcon()}
                <div>
                    <div className="font-medium">{title}</div>
                    {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {showActions && (
                    <>
                        <button onClick={handleRemove} className="text-gray-600">
                            <FileText size={16} />
                            {removeText}
                        </button>
                        <button onClick={handleEdit} className="text-gray-600">
                            <Trash2 size={16} />
                            {editText}
                        </button>
                    </>
                )}

                {/* Chế độ SELECTABLE: hiển thị checkbox */}
                {mode === "selectable" && (
                    <input type="checkbox" className="text-gray-800 size-6" onChange={onEdit} />
                )}

                {mode === "toggle" && (
                    <SwitchCustom
                        checked={isOn}
                        onCheckedChange={() => {
                            onEdit()
                            setIsOn(!isOn)
                        }}
                    />
                )}


                {(mode === "editable" || mode === "edit-delete") && (
                    <button
                    onClick={handleEdit}
                    className="text-gray-800 hover:text-yellow-500"
                    >
                        <Edit size={40} />
                    </button>
                )}

                {(mode === "deletable" || mode === "edit-delete") && (
                    <button
                        onClick={handleRemove}
                        className="text-gray-800 hover:text-red-600"
                    >
                        <Trash2 size={40} />
                    </button>
                )}

                {mode === "linkable" && (
                    <button
                        onClick={onClick}
                        className="text-gray-800 hover:text-blue-600"
                    >
                        <ChevronRight size={40} />
                    </button>
                )}
            </div>
        </div>
    )
}


export default FlexibleCard
