from django.db import models
from django.core.validators import RegexValidator



class Paciente(models.Model):
    # Validador para solo números
    phone_validator = RegexValidator(
        regex=r'^\d{10}$',
        message="El teléfono debe tener exactamente 10 dígitos numéricos"
    )
    
    cedula = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    email = models.EmailField(unique=True)
    
   
    telefono = models.CharField(
        max_length=10,
        validators=[phone_validator],
        unique=False,  
        blank=False,  
        null=False
    )
    
    direccion = models.TextField(blank=True, null=True)


    