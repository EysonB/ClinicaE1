from django.db import models
from django.utils import timezone
from pacientes.models import Paciente
from medicos.models import Medico
from citas.models import Cita

class Atencion(models.Model):
    ESTADOS_PAGO = [
        ('pendiente', 'Pendiente de pago'),
        ('pagado', 'Pagado'),
    ]

    cita = models.OneToOneField(Cita, on_delete=models.CASCADE, related_name='atencion')
    medico = models.ForeignKey(Medico, on_delete=models.PROTECT)
    paciente = models.ForeignKey(Paciente, on_delete=models.PROTECT)
    
    diagnostico = models.TextField()
    tratamiento = models.TextField(blank=True)
    observaciones = models.TextField(blank=True)
    
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    estado_pago = models.CharField(max_length=20, choices=ESTADOS_PAGO, default='pendiente')
    
    fecha_atencion = models.DateTimeField(default=timezone.now)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Atención #{self.id} - {self.paciente.nombre} - {self.estado_pago}"

    def save(self, *args, **kwargs):
        if self.cita:
            self.cita.estado = 'atendida'
            self.cita.save()
        super().save(*args, **kwargs)