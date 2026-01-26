from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework import status
from .models import Factura
from .serializers import FacturaSerializer, FacturaListSerializer


class FacturaListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: Lista todas las facturas
    POST: Crea una nueva factura (cobra una atención)
    """
    queryset = Factura.objects.all().select_related('atencion__paciente', 'atencion__medico')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numero_factura', 'atencion__paciente__nombre', 'atencion__paciente__apellido']
    ordering_fields = ['fecha_emision', 'monto']
    ordering = ['-fecha_emision']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FacturaListSerializer
        return FacturaSerializer

    def create(self, request, *args, **kwargs):
        # El monto se toma automáticamente de la atención
        if 'atencion' in request.data:
            from atenciones.models import Atencion
            try:
                atencion = Atencion.objects.get(id=request.data['atencion'])
                request.data['monto'] = str(atencion.monto)
            except Atencion.DoesNotExist:
                pass
        
        return super().create(request, *args, **kwargs)


class FacturaRetrieveAPIView(generics.RetrieveAPIView):
    """
    GET: Detalle de una factura
    """
    queryset = Factura.objects.all().select_related('atencion__paciente', 'atencion__medico')
    serializer_class = FacturaSerializer


class FacturaDestroyAPIView(generics.DestroyAPIView):
    """
    DELETE: Anular una factura
    Nota: Esto revertirá el estado de la atención a 'pendiente'
    """
    queryset = Factura.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Revertir estado de atención
        atencion = instance.atencion
        atencion.estado_pago = 'pendiente'
        atencion.save()
        
        # Eliminar factura
        self.perform_destroy(instance)
        
        return Response(
            {"message": "Factura anulada y atención marcada como pendiente."},
            status=status.HTTP_200_OK
        )