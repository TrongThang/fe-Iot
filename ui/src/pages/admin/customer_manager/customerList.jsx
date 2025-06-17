"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Users, UserCheck, UserX, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerTable } from "@/components/common/table/TableCustomer"
import { CustomerForm } from "./customerForm"

// Mock data based on the schema
const mockCustomers = [
    {
        id: "1",
        surname: "Nguyễn",
        lastname: "Văn An",
        image: "/placeholder.svg?height=40&width=40",
        phone: "+84901234567",
        email: "nguyen.van.an@email.com",
        email_verified: true,
        birthdate: "1990-05-15",
        gender: true,
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-20T14:45:00Z",
        deleted_at: null,
    },
    {
        id: "2",
        surname: "Trần",
        lastname: "Thị Bình",
        image: "/placeholder.svg?height=40&width=40",
        phone: "+84912345678",
        email: "tran.thi.binh@email.com",
        email_verified: false,
        birthdate: "1985-08-22",
        gender: false,
        created_at: "2024-01-10T09:15:00Z",
        updated_at: "2024-01-18T16:20:00Z",
        deleted_at: null,
    },
    {
        id: "3",
        surname: "Lê",
        lastname: "Minh Cường",
        image: "/placeholder.svg?height=40&width=40",
        phone: "+84923456789",
        email: "le.minh.cuong@email.com",
        email_verified: true,
        birthdate: "1992-12-03",
        gender: true,
        created_at: "2024-01-05T11:00:00Z",
        updated_at: "2024-01-25T13:30:00Z",
        deleted_at: "2024-01-26T10:00:00Z",
    },
    {
        id: "4",
        surname: "Phạm",
        lastname: "Thu Dung",
        image: "/placeholder.svg?height=40&width=40",
        phone: "+84934567890",
        email: "pham.thu.dung@email.com",
        email_verified: true,
        birthdate: "1988-03-18",
        gender: false,
        created_at: "2024-01-12T08:45:00Z",
        updated_at: "2024-01-22T15:10:00Z",
        deleted_at: null,
    },
    {
        id: "5",
        surname: "Hoàng",
        lastname: "Đức Em",
        image: "/placeholder.svg?height=40&width=40",
        phone: "+84945678901",
        email: "hoang.duc.em@email.com",
        email_verified: false,
        birthdate: "1995-07-09",
        gender: true,
        created_at: "2024-01-08T12:20:00Z",
        updated_at: "2024-01-19T17:55:00Z",
        deleted_at: null,
    },
]

export default function AdminCustomerDashboard() {
    const [customers, setCustomers] = useState(mockCustomers)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)

    const activeCustomers = customers.filter((c) => !c.deleted_at)
    const verifiedCustomers = activeCustomers.filter((c) => c.email_verified)
    const unverifiedCustomers = activeCustomers.filter((c) => !c.email_verified)
    const deletedCustomers = customers.filter((c) => c.deleted_at)

    const handleAddCustomer = () => {
        setEditingCustomer(null)
        setIsFormOpen(true)
    }

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer)
        setIsFormOpen(true)
    }

    const handleDeleteCustomer = (customerId) => {
        setCustomers((prev) =>
            prev.map((customer) =>
                customer.id === customerId ? { ...customer, deleted_at: new Date().toISOString() } : customer,
            ),
        )
    }

    const handleRestoreCustomer = (customerId) => {
        setCustomers((prev) =>
            prev.map((customer) => (customer.id === customerId ? { ...customer, deleted_at: null } : customer)),
        )
    }

    const handleSaveCustomer = (customerData) => {
        if (editingCustomer) {
            // Update existing customer
            setCustomers((prev) =>
                prev.map((customer) =>
                    customer.id === editingCustomer.id
                        ? { ...customer, ...customerData, updated_at: new Date().toISOString() }
                        : customer,
                ),
            )
        } else {
            // Add new customer
            const newCustomer = {
                ...customerData,
                id: (customers.length + 1).toString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
            }
            setCustomers((prev) => [...prev, newCustomer])
        }
        setIsFormOpen(false)
        setEditingCustomer(null)
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h1>
                    <p className="text-muted-foreground text-lg">Quản lý danh sách tài khoản khách hàng trong hệ thống IoT</p>
                </div>
                <Button onClick={handleAddCustomer}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm khách hàng
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCustomers.length}</div>
                        <p className="text-xs text-muted-foreground">Khách hàng đang hoạt động</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{verifiedCustomers.length}</div>
                        <p className="text-xs text-muted-foreground">Email đã được xác thực</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chưa xác thực</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unverifiedCustomers.length}</div>
                        <p className="text-xs text-muted-foreground">Email chưa xác thực</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã xóa</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{deletedCustomers.length}</div>
                        <p className="text-xs text-muted-foreground">Tài khoản đã bị xóa</p>
                    </CardContent>
                </Card>
            </div>

            {/* Customer Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khách hàng</CardTitle>
                    <CardDescription>Quản lý và theo dõi thông tin khách hàng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomerTable
                        customers={customers}
                        onEdit={handleEditCustomer}
                        onDelete={handleDeleteCustomer}
                        onRestore={handleRestoreCustomer}
                    />
                </CardContent>
            </Card>

            {/* Customer Form Dialog */}
            <CustomerForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                customer={editingCustomer}
                onSave={handleSaveCustomer}
            />
        </div>
    )
}
