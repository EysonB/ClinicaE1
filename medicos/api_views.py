from rest_framework import generics
from .models import Medico
from .serializers import MedicoSerializer

class MedicoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
