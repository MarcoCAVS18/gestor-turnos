# Security Fixes - Implementation Guide

Este documento explica cómo aplicar los fixes de seguridad identificados en el Security Audit.

---

## 📋 Archivos Generados

1. **SECURITY_AUDIT_REPORT.md** - Reporte completo de auditoría
2. **firestore.rules.SECURE** - Firestore rules corregidas
3. **storage.rules.SECURE** - Storage rules corregidas

---

## 🔴 CRITICAL FIXES - APLICAR INMEDIATAMENTE

### Fix 1: Actualizar Firestore Rules

**Archivo:** `firestore.rules`

**Acción:**
```bash
# Backup de las rules actuales
cp firestore.rules firestore.rules.BACKUP

# Aplicar las nuevas rules seguras
cp firestore.rules.SECURE firestore.rules

# Desplegar a Firebase
firebase deploy --only firestore:rules
```

**Cambios aplicados:**
- ✅ Users: Solo puedes leer tu propio perfil (antes: cualquiera autenticado podía leer todos)
- ✅ shared_works: Solo lectura si `isPublic == true` (antes: lectura pública total)
- ✅ Eliminada colección `stats` no usada

**⚠️ IMPORTANTE:** Esto puede romper features que dependan de leer perfiles de otros usuarios. Revisa tu código antes de desplegar.

---

### Fix 2: Actualizar Storage Rules

**Archivo:** `storage.rules`

**Acción:**
```bash
# Backup de las rules actuales
cp storage.rules storage.rules.BACKUP

# Aplicar las nuevas rules seguras
cp storage.rules.SECURE storage.rules

# Desplegar a Firebase
firebase deploy --only storage
```

**Cambios aplicados:**
- ✅ Límite de 5MB por archivo
- ✅ Solo imágenes permitidas (jpg, jpeg, png, gif, webp)
- ✅ Validación de extensión de archivo

**⚠️ IMPORTANTE:** Esto puede rechazar uploads actuales que excedan 5MB. Ajusta el límite si es necesario.

---

## 🟠 HIGH PRIORITY FIXES - APLICAR ANTES DE PRODUCCIÓN

### Fix 3: Actualizar profilePhotoService.js

**Archivo:** `src/services/profilePhotoService.js`

Ya tienes validación de 5MB en línea 34, pero agrega validación de tipo:

```javascript
export const uploadProfilePhoto = async (userId, file) => {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed');
  }

  // Existing size validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }

  // ... rest of existing code
};
```

---

### Fix 4: Agregar Rate Limiting a Password Reset

**Archivo:** `src/contexts/AuthContext.jsx`

Agrega rate limiting antes de `sendPasswordResetEmail`:

```javascript
// Add to AuthContext state
const [resetAttempts, setResetAttempts] = useState({});

const resetPassword = async (email) => {
  const now = Date.now();
  const lastAttempt = resetAttempts[email] || 0;
  const COOLDOWN_MS = 60000; // 1 minute

  if (now - lastAttempt < COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastAttempt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before requesting another password reset`);
  }

  setResetAttempts(prev => ({ ...prev, [email]: now }));

  try {
    setError('');
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    setError('Error sending password reset email: ' + error.message);
    throw error;
  }
};
```

---

## 🟡 MEDIUM PRIORITY FIXES

### Fix 5: Input Sanitization (Recomendado)

**Instalar DOMPurify:**
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

**Uso en formularios:**
```javascript
import DOMPurify from 'dompurify';

// Before saving to Firestore
const sanitizedName = DOMPurify.sanitize(workName);
const sanitizedNotes = DOMPurify.sanitize(notes);
```

**Aplicar en:**
- Work creation/edit
- Shift notes
- User profile updates

---

### Fix 6: Security Headers en firebase.json

**Archivo:** `firebase.json`

Agrega headers en la sección de hosting:

```json
{
  "hosting": {
    "public": "build",
    "ignore": [...],
    "rewrites": [...],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

Luego despliega:
```bash
firebase deploy --only hosting
```

---

## ✅ TESTING DESPUÉS DE APLICAR FIXES

### 1. Test Firestore Rules

```bash
# En Firebase Console → Firestore → Rules
# Usa el Rules Playground para probar:

# Test 1: Try to read another user's profile (should fail)
match /users/OTHER_USER_ID
allow read: if request.auth.uid = 'YOUR_USER_ID'

# Test 2: Try to create work with wrong userId (should fail)
match /works/NEW_WORK_ID
allow create: if request.resource.data.userId != 'YOUR_USER_ID'
```

### 2. Test Storage Rules

- Intenta subir un archivo de 10MB (debe fallar)
- Intenta subir un .exe (debe fallar)
- Intenta subir una imagen válida de 3MB (debe funcionar)

### 3. Test Rate Limiting

- Intenta resetear password 3 veces seguidas
- La tercera debe fallar con mensaje de cooldown

---

## 🚨 ROLLBACK PLAN

Si algo falla después de aplicar los fixes:

### Rollback Firestore Rules:
```bash
cp firestore.rules.BACKUP firestore.rules
firebase deploy --only firestore:rules
```

### Rollback Storage Rules:
```bash
cp storage.rules.BACKUP storage.rules
firebase deploy --only storage
```

### Rollback Código:
```bash
git revert HEAD
```

---

## 📊 CHECKLIST DE IMPLEMENTACIÓN

### Pre-Deployment:
- [ ] Leer SECURITY_AUDIT_REPORT.md completo
- [ ] Hacer backup de rules actuales
- [ ] Revisar si alguna feature depende de leer perfiles de otros
- [ ] Testear localmente con Firebase Emulator

### Deployment:
- [ ] Aplicar firestore.rules.SECURE
- [ ] Aplicar storage.rules.SECURE
- [ ] Desplegar a Firebase
- [ ] Testear en producción

### Post-Deployment:
- [ ] Verificar que no hay errores en Firebase Console
- [ ] Testear flujos críticos (login, upload, etc.)
- [ ] Monitorear por 24-48 horas

### Code Changes (Antes de próximo deploy):
- [ ] Agregar validación de tipo en uploadProfilePhoto
- [ ] Agregar rate limiting a password reset
- [ ] Instalar y usar DOMPurify
- [ ] Agregar security headers en firebase.json

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisa Firebase Console → Rules para errores
2. Revisa browser console para errores de permisos
3. Usa el Rules Playground para debug
4. Haz rollback si es crítico

---

**¡IMPORTANTE!** Estos fixes mejoran significativamente la seguridad, pero pueden requerir ajustes en tu código. Testea todo antes de producción.
