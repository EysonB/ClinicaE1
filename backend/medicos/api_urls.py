from django.urls import path
from .api_views import MedicoListCreateAPIView, MedicoDetailAPIView

urlpatterns = [
    path('medicos/', MedicoListCreateAPIView.as_view(), name='api_medicos'),
    path('medicos/<int:pk>/', MedicoDetailAPIView.as_view(), name='medicos-detail'),
]
