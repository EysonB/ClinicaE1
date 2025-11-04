from rest_framework import generics
from .models import Cita
from .serializers import CitaSerializer

class CitaListAPI(generics.ListCreateAPIView):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
