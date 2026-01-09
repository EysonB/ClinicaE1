from rest_framework.viewsets import ModelViewSet
from .models import Medico
from .serializers import MedicoSerializer

class MedicoViewSet(ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
