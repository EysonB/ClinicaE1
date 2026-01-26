from django.urls import path
from .api_views import (
    FacturaListCreateAPIView,
    FacturaRetrieveAPIView,
    FacturaDestroyAPIView,
)

urlpatterns = [
    path('facturas/', FacturaListCreateAPIView.as_view(), name='factura-list-create'),
    path('facturas/<int:pk>/', FacturaRetrieveAPIView.as_view(), name='factura-detail'),
    path('facturas/<int:pk>/anular/', FacturaDestroyAPIView.as_view(), name='factura-anular'),
]