from django.urls import path
from .api_views import CitaListCreateAPIView, CitaDetailAPIView

urlpatterns = [
    path('citas/', CitaListCreateAPIView.as_view(), name='api_citas'),
    path('citas/<int:pk>/', CitaDetailAPIView.as_view(), name='api_cita_detail'),
]

