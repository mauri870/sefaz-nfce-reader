import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Clipboard from "expo-clipboard";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Feather } from "@expo/vector-icons";
import { Button, Text, Dialog, Portal, Provider } from "react-native-paper";

export default function Home() {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [nfceId, setNfceId] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleBarCodeScanned = (bar: { type: string; data: string }) => {
        setScanned(true);
        const id = bar.data.split("?p=")[1].split("|")[0] || "";
        if (!id) {
            alert("The QR code is not a valid SEFAZ NFCE.");
            return;
        }
        setDialogVisible(true);
        setNfceId(id);
        copyToClipboard();
    };

    const copyToClipboard = () => {
        alert("NFCE Id copied to clipboard!");
        Clipboard.setString(nfceId);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <Provider>
            <View style={styles.container}>
                <BarCodeScanner
                    barCodeTypes={["256"]}
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                    style={StyleSheet.absoluteFillObject}
                />

                <Portal>
                    <Dialog
                        visible={dialogVisible}
                        onDismiss={() => setDialogVisible(false)}
                    >
                        <Dialog.Title>NFCE ID</Dialog.Title>
                        <Dialog.Content>
                            <Text
                                selectable
                                style={{
                                    backgroundColor: "#97979797",
                                    color: "#000000",
                                }}
                            >
                                {nfceId}
                            </Text>
                            <Button onPress={() => copyToClipboard()}>
                                <Feather
                                    name="copy"
                                    size={22}
                                    color="#727272"
                                />
                            </Button>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>
                                Ok
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                {scanned && (
                    <Button
                        style={styles.openButton}
                        onPress={() => setScanned(false)}
                    >
                        Tap to scan again!
                    </Button>
                )}
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    openButton: {
        backgroundColor: "#ffffff",
        padding: 10,
        marginHorizontal: 30,
        elevation: 2,
    },
});
