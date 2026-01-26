from django.db import models
from atenciones.models import Atencion

class Factura(models.Model):
    METODOS_PAGO = [
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('transferencia', 'Transferencia'),
    ]

    atencion = models.OneToOneField(Atencion, on_delete=models.PROTECT, related_name='factura')
    numero_factura = models.CharField(max_length=20, unique=True, editable=False)
    
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO)
    fecha_emision = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Factura {self.numero_factura} - ${self.monto}"

    def save(self, *args, **kwargs):
        if not self.numero_factura:
            ultimo = Factura.objects.all().order_by('id').last()
            numero = int(ultimo.numero_factura.split('-')[1]) + 1 if ultimo else 1
            self.numero_factura = f"FAC-{numero:06d}"
        
        if self.atencion:
            self.atencion.estado_pago = 'pagado'
            self.atencion.save()
        
        super().save(*args, **kwargs)