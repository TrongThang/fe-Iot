"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, X, Camera, RotateCcw } from "lucide-react"

export default function QRScannerDialog({ open, onOpenChange, onScanResult }) {
    const [scannedData, setScannedData] = useState("")
    const [isScanning, setIsScanning] = useState(true)
    const [deviceId, setDeviceId] = useState("")
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    // Mock QR codes for demonstration
    const mockQRCodes = ["1234-5678-6565-3333", "DEVICE-ABC-123-XYZ", "IOT-SENSOR-2024-001", "SMART-HOME-DEV-456"]

    useEffect(() => {
        if (open && isScanning) {
            startCamera()
            // Simulate QR code detection after 3 seconds
            const timer = setTimeout(() => {
                const randomQR = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)]
                handleQRDetected(randomQR)
            }, 3000)

            return () => {
                clearTimeout(timer)
                stopCamera()
            }
        }
    }, [open, isScanning])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (error) {
            console.error("Error accessing camera:", error)
            // Fallback: show mock scanner interface
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks()
            tracks.forEach((track) => track.stop())
        }
    }

    const handleQRDetected = (data) => {
        setScannedData(data)
        setDeviceId(data)
        setIsScanning(false)
    }

    const handleOK = () => {
        if (scannedData) {
            onScanResult?.(scannedData)
            onOpenChange(false)
            resetScanner()
        }
    }

    const handleClear = () => {
        setScannedData("")
        setDeviceId("")
        setIsScanning(true)
    }

    const handleClose = () => {
        onOpenChange(false)
        resetScanner()
    }

    const resetScanner = () => {
        setScannedData("")
        setDeviceId("")
        setIsScanning(true)
        stopCamera()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[350px]  p-0 rounded-2xl shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-gray-900">Quét mã QR</DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="px-6 py-6 space-y-2 bg-gray-50">
                    {/* Device ID Input */}
                    <div className="space-y-2">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                placeholder="ID Thiết bị"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                            />
                        </div>
                    </div>

                    {/* QR Scanner Area */}
                    <div className="relative">
                        <div className="aspect-square bg-black rounded-2xl overflow-hidden relative">
                            {/* Camera Video */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ display: isScanning ? "block" : "none" }}
                            />

                            {/* Mock QR Code Display */}
                            {!isScanning && scannedData && (
                                <div className="w-full h-full flex items-center justify-center bg-white">
                                    <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                        {/* Mock QR Code Pattern */}
                                        <div className="w-40 h-40 bg-black relative">
                                            <div className="absolute inset-2 bg-white"></div>
                                            <div className="absolute top-2 left-2 w-8 h-8 bg-black"></div>
                                            <div className="absolute top-2 right-2 w-8 h-8 bg-black"></div>
                                            <div className="absolute bottom-2 left-2 w-8 h-8 bg-black"></div>
                                            <div
                                                className="absolute inset-4 bg-black opacity-60"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.8'%3E%3Crect x='0' y='0' width='4' height='4'/%3E%3Crect x='8' y='0' width='4' height='4'/%3E%3Crect x='16' y='0' width='4' height='4'/%3E%3Crect x='4' y='4' width='4' height='4'/%3E%3Crect x='12' y='4' width='4' height='4'/%3E%3Crect x='0' y='8' width='4' height='4'/%3E%3Crect x='8' y='8' width='4' height='4'/%3E%3Crect x='16' y='8' width='4' height='4'/%3E%3Crect x='4' y='12' width='4' height='4'/%3E%3Crect x='12' y='12' width='4' height='4'/%3E%3Crect x='0' y='16' width='4' height='4'/%3E%3Crect x='8' y='16' width='4' height='4'/%3E%3Crect x='16' y='16' width='4' height='4'/%3E%3C/g%3E%3C/svg%3E")`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {isScanning && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="text-white text-center">
                                        <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                                        <p className="text-sm">Đang quét mã QR...</p>
                                    </div>
                                </div>
                            )}

                            {/* Scanner Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Corner brackets */}
                                <div className="absolute top-8 left-8 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                                <div className="absolute top-8 right-8 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                                <div className="absolute bottom-8 left-8 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                                <div className="absolute bottom-8 right-8 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg"></div>

                                {/* Scanning line animation */}
                                {isScanning && <div className="absolute inset-x-8 top-1/2 h-0.5 bg-red-500 animate-pulse"></div>}
                            </div>
                        </div>

                        {/* Scanned Result */}
                        {scannedData && (
                            <div className="mt-4 text-center">
                                <p className="text-lg font-mono font-semibold text-gray-900 bg-white px-4 py-2 rounded-lg border">
                                    {scannedData}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button
                            onClick={handleOK}
                            disabled={!scannedData}
                            className="flex-1 h-10 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Xác nhận
                        </Button>
                    </div>

                    {/* Rescan Button */}
                    {!isScanning && (
                        <Button
                            onClick={handleClear}
                            variant="outline"
                            className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-center space-x-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Quét lại</span>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
