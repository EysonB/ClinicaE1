from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework import status
from .models import Atencion
from .serializers import AtencionSerializer, AtencionListSerializer


class AtencionListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: Lista todas las atenciones
    POST: Crea una nueva atención
    """
    queryset = Atencion.objects.all().select_related('paciente', 'medico', 'cita')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['paciente__nombre', 'paciente__apellido', 'diagnostico']
    ordering_fields = ['fecha_atencion', 'monto', 'estado_pago']
    ordering = ['-fecha_atencion']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AtencionListSerializer
        return AtencionSerializer

    def perform_create(self, serializer):
        # Automáticamente asignar paciente y médico desde la cita
        cita = serializer.validated_data['cita']
        serializer.save(
            paciente=cita.paciente,
            medico=cita.medico
        )


class AtencionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Detalle de una atención
    PUT/PATCH: Actualizar atención
    DELETE: Eliminar atención
    """
    queryset = Atencion.objects.all().select_related('paciente', 'medico', 'cita')
    serializer_class = AtencionSerializer

    def destroy(self, request, *args, **kwargs):
        """No permitir eliminar si ya tiene factura"""
        instance = self.get_object()
        if hasattr(instance, 'factura'):
            return Response(
                {"error": "No se puede eliminar una atención que ya tiene factura."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


class AtencionesPendientesAPIView(generics.ListAPIView):
    """
    GET: Lista solo las atenciones pendientes de pago
    Útil para el módulo de facturación
    """
    serializer_class = AtencionListSerializer
    
    def get_queryset(self):
        return Atencion.objects.filter(
            estado_pago='pendiente'
        ).select_related('paciente', 'medico', 'cita').order_by('-fecha_atencion')