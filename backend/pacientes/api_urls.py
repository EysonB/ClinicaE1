from django.urls import path
from .api_views import (
    PacienteListCreateAPIView,
    PacienteDetailAPIView
)

urlpatterns = [
    path('pacientes/', PacienteListCreateAPIView.as_view(), name='api_pacientes'),
    path('pacientes/<int:pk>/', PacienteDetailAPIView.as_view(), name='api_paciente_detail'),
]
