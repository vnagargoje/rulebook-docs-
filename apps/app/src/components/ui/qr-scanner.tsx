import { CameraView, useCameraPermissions } from 'expo-camera'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface QrScannerProps {
    onScan: (data: string) => void
    onClose?: () => void
    title?: string
    description?: string
}

export function QrScanner({ onScan, onClose, title, description }: QrScannerProps) {
    const [permission, requestPermission] = useCameraPermissions()
    const [scanned, setScanned] = useState(false)
    const isScanned = React.useRef(false)

    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    size='large'
                    color='#ffffff'
                />
            </View>
        )
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Camera permission needed</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={requestPermission}>
                    <Text style={styles.buttonText}>Allow Camera</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (!isScanned.current && data) {
            isScanned.current = true
            setScanned(true)
            onScan(data)
            // Reset after a short delay so the next battery can be scanned
            setTimeout(() => {
                isScanned.current = false
                setScanned(false)
            }, 1500)
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing='back'
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}>
                <View style={styles.overlay}>
                    {onClose && (
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.scannerFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <View style={styles.infoContainer}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {description && <Text style={styles.description}>{description}</Text>}
                    </View>
                </View>
            </CameraView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#ffffff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        color: '#ffffff',
        fontSize: 20,
    },
    scannerFrame: {
        width: 250,
        height: 250,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#2563eb',
    },
    topLeft: {
        top: -2,
        left: -2,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 15,
    },
    topRight: {
        top: -2,
        right: -2,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 15,
    },
    bottomLeft: {
        bottom: -2,
        left: -2,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 15,
    },
    bottomRight: {
        bottom: -2,
        right: -2,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 15,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
})
