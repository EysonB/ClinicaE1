
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pacientes/', include('pacientes.urls', namespace='paciente_list')),
    path('medicos/', include('medicos.urls', namespace='medico_list')),
    path('citas/', include('citas.urls', namespace='citas')),
 
]
