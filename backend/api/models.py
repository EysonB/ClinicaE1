from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Usuario(models.Model):
    ROLES = [
        ('admin', 'Administrador'),
        ('medico', 'Médico'),
        ('enfermera', 'Enfermera/Recepción'),
    ]
    
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    rol = models.CharField(max_length=20, choices=ROLES)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Referencia al médico si el rol es 'medico'
    medico = models.OneToOneField(
        'medicos.Medico',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='usuario'  # ← IMPORTANTE para evitar conflictos
    )
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
    
    def __str__(self):
        return f"{self.nombre} ({self.get_rol_display()})"
    
    def set_password(self, raw_password):
        """Hashear la contraseña"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verificar contraseña"""
        return check_password(raw_password, self.password)
    
    def save(self, *args, **kwargs):
        # Hashear contraseña automáticamente si no está hasheada
        if self.password and not self.password.startswith('pbkdf2_'):
            self.set_password(self.password)
        super().save(*args, **kwargs)