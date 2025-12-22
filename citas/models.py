from django.db import models
from pacientes.models import Paciente
from medicos.models import Medico

class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente')

    def __str__(self):
        return f"Cita {self.paciente.nombre} con {self.medico.nombre} el {self.fecha}"



"""
CitasList

Tiene el estado citas

Hace GET /api/citas/

CitasList renderiza:

La lista

El <CitaForm />

CitasList le pasa a CitaForm una función:

onCitaCreada

CitaForm:

Hace el POST

Cuando Django responde OK

Llama a onCitaCreada(nuevaCita)

CitasList:

Agrega esa cita al estado

React re-renderiza

🎉 aparece sin recargar"""
