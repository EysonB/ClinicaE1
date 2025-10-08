from django.urls import path
from . import views

app_name = 'citas'

urlpatterns = [
    path('', views.cita_list, name='cita_list'),
    path('crear/', views.cita_create, name='cita_create'),
    path('<int:pk>/editar/', views.cita_edit, name='cita_edit'),
    path('<int:pk>/eliminar/', views.cita_delete, name='cita_delete'),
]
