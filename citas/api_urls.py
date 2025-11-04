from django.urls import path
from . import api_views  # archivo donde pondremos la vista de la API

urlpatterns = [
    path('citas/', api_views.CitaListAPI.as_view(), name='api_cita_list'),
]