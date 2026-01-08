from rest_framework.viewsets import ModelViewSet
from .models import Paciente
from .serializers import PacienteSerializer

class PacienteViewSet(ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
