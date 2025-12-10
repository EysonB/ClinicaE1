from django.urls import path
from . import api_views

urlpatterns = [
    path('', api_views.pacientes_api, name='api_pacientes'),
]
