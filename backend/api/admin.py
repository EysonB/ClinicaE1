from django.contrib import admin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'rol', 'activo', 'medico', 'created_at']
    list_filter = ['rol', 'activo']
    search_fields = ['nombre', 'email']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'email', 'password')
        }),
        ('Permisos', {
            'fields': ('rol', 'medico', 'activo')
        }),
        ('Fechas', {
            'fields': ('created_at',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Si es una creación o si la contraseña cambió, hashearla
        if not change or 'password' in form.changed_data:
            if obj.password and not obj.password.startswith('pbkdf2_'):
                obj.set_password(obj.password)
        super().save_model(request, obj, form, change)