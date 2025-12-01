from django.urls import path
from rest_framework import generics
from .models import Cita
from .serializers import CitaSerializer

class CitaListCreate(generics.ListCreateAPIView):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

class CitaRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

urlpatterns = [
    path('citas/', CitaListCreate.as_view(), name='cita_list_create'),
    path('citas/<int:pk>/', CitaRetrieveUpdateDelete.as_view(), name='cita_detail'),
]
