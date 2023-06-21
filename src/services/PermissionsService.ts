import { PermissionsAndroid } from 'react-native'

export const RequestPermissions = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Acesso ao armazenamento externo concedido pelo usuário.")

    } else console.log("O acesso ao armazenamento externo foi negado pelo usuário.")
}