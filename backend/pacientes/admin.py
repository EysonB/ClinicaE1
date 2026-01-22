from django.contrib import admin
from .models import Paciente

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ['id', 'cedula', 'nombre', 'apellido', 'email', 'telefono'] 
    search_fields = ['cedula', 'nombre', 'apellido', 'email']
    list_filter = ['fecha_nacimiento']