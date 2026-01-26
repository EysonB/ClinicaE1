from django.urls import path
from .api_views import (
    AtencionListCreateAPIView,
    AtencionRetrieveUpdateDestroyAPIView,
    AtencionesPendientesAPIView,
)

urlpatterns = [
    path('atenciones/', AtencionListCreateAPIView.as_view(), name='atencion-list-create'),
    path('atenciones/<int:pk>/', AtencionRetrieveUpdateDestroyAPIView.as_view(), name='atencion-detail'),
    path('atenciones/pendientes/', AtencionesPendientesAPIView.as_view(), name='atenciones-pendientes'),
]