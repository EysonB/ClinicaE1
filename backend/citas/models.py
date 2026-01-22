from django.db import models

class Cita(models.Model):
    paciente = models.ForeignKey(
        "pacientes.Paciente",
        on_delete=models.CASCADE,
        related_name="citas"
    )
    medico = models.ForeignKey(
        "medicos.Medico",
        on_delete=models.CASCADE,
        related_name="citas"
    )
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_CHOICES,
        default='pendiente'
    )

    def __str__(self):
        return f"Cita {self.paciente} con {self.medico} el {self.fecha}"
