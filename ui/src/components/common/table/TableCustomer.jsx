"use client"

import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Edit, Trash2, RotateCcw, Mail, Phone, Image, Copy } from "lucide-react"

export function CustomerTable({ customers, onEdit, onDelete, onRestore }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !customer.deleted_at) ||
      (statusFilter === "deleted" && customer.deleted_at)

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && customer.email_verified) ||
      (verificationFilter === "unverified" && !customer.email_verified)

    return matchesSearch && matchesStatus && matchesVerification
  })

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
  }

  const getStatusBadge = (customer) => {
    if (customer.deleted_at) {
      return <Badge variant="destructive" className="bg-red-300 text-red-800">Đã xóa</Badge>
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">Hoạt động</Badge>
  }

  const getVerificationBadge = (verified) => {
    return verified ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Đã xác thực
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">Chưa xác thực</Badge>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Xác thực" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="verified">Đã xác thực</SelectItem>
            <SelectItem value="unverified">Chưa xác thực</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Xác thực</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={customer.image || "/placeholder.svg"}
                      alt={`${customer.surname} ${customer.lastname}`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">
                        {customer.surname} {customer.lastname}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.gender ? "Nam" : "Nữ"}</Badge>
                </TableCell>
                <TableCell>{format(new Date(customer.birthdate), "dd/MM/yyyy", { locale: vi })}</TableCell>
                <TableCell>{getStatusBadge(customer)}</TableCell>
                <TableCell>{getVerificationBadge(customer.email_verified)}</TableCell>
                <TableCell>{formatDate(customer.created_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      {customer.deleted_at ? (
                        <DropdownMenuItem onClick={() => onRestore(customer.id)}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Khôi phục
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onDelete(customer.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Không tìm thấy khách hàng nào phù hợp với bộ lọc.</div>
      )}
    </div>
  )
}
