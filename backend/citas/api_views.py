from rest_framework import generics
from .models import Cita
from .serializers import CitaSerializer

class CitaListCreateAPIView(generics.ListCreateAPIView):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer


class CitaDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
