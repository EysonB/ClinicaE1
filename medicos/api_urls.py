from django.urls import path
from .api_views import MedicoListCreateAPIView

urlpatterns = [
    path('medicos/', MedicoListCreateAPIView.as_view(), name='api_medicos'),
]
