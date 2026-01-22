
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('citas.api_urls')),
    path('api/', include('medicos.api_urls')),
    path('api/', include('pacientes.api_urls')),
]
