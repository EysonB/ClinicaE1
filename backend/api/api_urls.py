from django.urls import path
from .api_views import login_view, logout_view, usuarios_list_create, usuario_detail

urlpatterns = [
    path('auth/login', login_view, name='login'),
    path('auth/logout', logout_view, name='logout'),
    path('usuarios/', usuarios_list_create, name='usuarios-list-create'),
    path('usuarios/<int:pk>/', usuario_detail, name='usuario-detail'),
]