"""
Constantes del sistema
"""

# Roles del sistema
ROLES = {
    'ADMIN': 'Admin',
    'USER': 'User',
    'MEMBER': 'Member'
}

# Estados de usuario
USER_STATUS = {
    'ACTIVE': True,
    'INACTIVE': False
}

# Tipos de permisos
PERMISSION_TYPES = {
    'CREATE': 'add',
    'READ': 'view',
    'UPDATE': 'change',
    'DELETE': 'delete'
}

# Configuración de JWT
JWT_SETTINGS = {
    'ACCESS_TOKEN_LIFETIME': 5,  # minutos
    'REFRESH_TOKEN_LIFETIME': 1440,  # minutos (24 horas)
}

# Mensajes del sistema
MESSAGES = {
    'USER_CREATED': 'Usuario creado exitosamente',
    'USER_UPDATED': 'Usuario actualizado exitosamente',
    'USER_DELETED': 'Usuario eliminado exitosamente',
    'PASSWORD_CHANGED': 'Contraseña cambiada exitosamente',
    'LOGIN_SUCCESS': 'Inicio de sesión exitoso',
    'LOGOUT_SUCCESS': 'Cierre de sesión exitoso',
    'PERMISSION_DENIED': 'No tienes permisos para realizar esta acción',
    'INVALID_CREDENTIALS': 'Credenciales inválidas',
    'USER_NOT_FOUND': 'Usuario no encontrado'
} 