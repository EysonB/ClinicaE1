from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Medico
from .serializers import MedicoSerializer


class MedicoListCreateAPIView(ListCreateAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer


class MedicoDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

