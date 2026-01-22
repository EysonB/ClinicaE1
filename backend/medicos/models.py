from django.db import models

class Medico(models.Model):
    cedula = models.CharField(max_length=10, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    especialidad = models.CharField(max_length=100)
    #usuario_id = models.IntegerField()  # Puedes cambiar a ForeignKey si usas la app Usuarios

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.especialidad}"
