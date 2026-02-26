from django.urls import path
from . import views

urlpatterns = [
    # ... tus rutas existentes ...
    
    # Autenticación
    path('auth/login', views.login, name='login'),
    path('auth/register', views.register, name='register'),
    path('usuarios', views.get_usuarios, name='get_usuarios'),
]