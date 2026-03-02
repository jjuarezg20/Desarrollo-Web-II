import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase'

const normalizeEmail = (email) => email.trim().toLowerCase()
const normalizeName = (name) => name.trim()

export const registerUser = async (email, password, displayName) => {
  try {
    const cleanEmail = normalizeEmail(email)
    const cleanDisplayName = normalizeName(displayName)

    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password)

    await updateProfile(userCredential.user, {
      displayName: cleanDisplayName,
    })

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: cleanDisplayName,
      },
    }
  } catch (error) {
    console.error('Firebase register error:', error.code, error.message)
    return {
      success: false,
      error: handleAuthError(error.code),
    }
  }
}

export const loginUser = async (email, password) => {
  try {
    const cleanEmail = normalizeEmail(email)
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password)

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      },
    }
  } catch (error) {
    console.error('Firebase login error:', error.code, error.message)
    return {
      success: false,
      error: handleAuthError(error.code),
    }
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Error al cerrar sesion',
    }
  }
}

const handleAuthError = (errorCode) => {
  const errors = {
    'auth/email-already-in-use': 'Este correo ya esta registrado',
    'auth/invalid-email': 'Correo electronico invalido',
    'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres',
    'auth/operation-not-allowed': 'Debes habilitar Email/Password en Firebase Authentication.',
    'auth/configuration-not-found': 'No se encontro la configuracion de Authentication en Firebase.',
    'auth/invalid-api-key': 'API Key invalida. Verifica tu archivo .env.',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      'API Key invalida o incompleta. Copia la API Key exacta desde Firebase y actualiza VITE_FIREBASE_API_KEY.',
    'auth/app-not-authorized': 'Dominio no autorizado. Agrega tu dominio en Firebase Authentication.',
    'auth/missing-email': 'Debes ingresar un correo electronico.',
    'auth/missing-password': 'Debes ingresar una contrasena.',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contrasena incorrecta',
    'auth/invalid-credential': 'Correo o contrasena incorrectos',
    'auth/too-many-requests': 'Demasiados intentos. Intenta mas tarde',
    'auth/network-request-failed': 'Error de conexion. Verifica tu internet',
  }

  return errors[errorCode] || `Error de autenticacion (${errorCode || 'desconocido'})`
}
