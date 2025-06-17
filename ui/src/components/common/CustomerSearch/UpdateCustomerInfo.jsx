// UpdateCustomerForm.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { useState, useEffect } from "react"

export default function UpdateCustomerForm({
    isOpen,
    onClose,
    updateForm,
    setUpdateForm,
    onUpdate
}) {
    const [errors, setErrors] = useState({})
    const [phoneNumber, setPhoneNumber] = useState('')

    // Xử lý khi form mở
    useEffect(() => {
        if (isOpen) {
            setPhoneNumber(updateForm.phone || '')
            setErrors({})
        }
    }, [isOpen, updateForm])

    // Xử lý số điện thoại
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '') // Chỉ cho phép nhập số
        if (value.length <= 10) { // Giới hạn 10 số
            setPhoneNumber(value)
            setUpdateForm(prev => ({ ...prev, phone: value }))
            // Xóa lỗi khi người dùng bắt đầu nhập
            if (errors.phone) {
                setErrors(prev => ({ ...prev, phone: null }))
            }
        }
    }

    // Validate form trước khi submit
    const validateForm = () => {
        const newErrors = {}

        // Validate họ
        if (!updateForm.surname?.trim()) {
            newErrors.surname = 'Vui lòng nhập họ'
        }

        // Validate tên
        if (!updateForm.lastname?.trim()) {
            newErrors.lastname = 'Vui lòng nhập tên'
        }

        // Validate số điện thoại
        if (!phoneNumber) {
            newErrors.phone = 'Vui lòng nhập số điện thoại'
        } else if (phoneNumber.length !== 10) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Xử lý submit form
    const handleSubmit = () => {
        if (validateForm()) {
            onUpdate()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">Cập nhật thông tin khách hàng</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="surname" className="text-sm font-medium text-slate-700">
                                Họ <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="surname"
                                value={updateForm.surname || ''}
                                onChange={(e) => setUpdateForm(prev => ({ ...prev, surname: e.target.value }))}
                                className={`w-full ${errors.surname ? 'border-red-500' : ''}`}
                                placeholder="Nhập họ..."
                            />
                            {errors.surname && (
                                <p className="text-sm text-red-500 mt-1">{errors.surname}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastname" className="text-sm font-medium text-slate-700">
                                Tên <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lastname"
                                value={updateForm.lastname || ''}
                                onChange={(e) => setUpdateForm(prev => ({ ...prev, lastname: e.target.value }))}
                                className={`w-full ${errors.lastname ? 'border-red-500' : ''}`}
                                placeholder="Nhập tên..."
                            />
                            {errors.lastname && (
                                <p className="text-sm text-red-500 mt-1">{errors.lastname}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={updateForm.email || ''}
                                readOnly
                                className="w-full bg-slate-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                Số điện thoại <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                type="text"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                                placeholder="Nhập số điện thoại..."
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="birthdate" className="text-sm font-medium text-slate-700">
                                Ngày sinh
                            </Label>
                            <Input
                                id="birthdate"
                                type="date"
                                value={updateForm.birthdate || ''}
                                onChange={(e) => {
                                    setUpdateForm(prev => ({
                                        ...prev,
                                        birthdate: e.target.value
                                    }));
                                }}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-500" />
                                Giới tính
                            </Label>
                            <div className="flex items-center gap-4 mt-5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={updateForm.gender === true}
                                        onChange={() => setUpdateForm(prev => ({ ...prev, gender: true }))}
                                        className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">Nam</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={updateForm.gender === false}
                                        onChange={() => setUpdateForm(prev => ({ ...prev, gender: false }))}
                                        className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">Nữ</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-6"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        Cập nhật
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}