from django.urls import path
from . import views

app_name='pacientes'

urlpatterns = [
    path('', views.paciente_list_and_create, name='paciente_list'),
    path('api/', include('pacientes.api_urls'))
]