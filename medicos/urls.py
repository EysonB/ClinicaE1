from django.urls import path
from . import views

app_name = 'medicos'

urlpatterns = [
    path('', views.medico_list, name='medico_list'),
    path('crear/', views.medico_create, name='medico_create'),
]

