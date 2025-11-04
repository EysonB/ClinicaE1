from django.shortcuts import render, redirect
from .models  import Paciente
from .forms import PacienteForm

def paciente_list_and_create(request):
    if request.method == 'POST':
        form = PacienteForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('pacientes:paciente_list')
    else:
        form = PacienteForm()
        
    #pacientes = Paciente.objects.all()
    #paciente_confirmado = Paciente.objects.filter(is_completed = True)
    #paciente_cancelado = Paciente.objects.filter(is_completed = False)

    return render (request, 'paciente_list.html', {
                    'form':form,
                    #'pacientes':pacientes
                    
                    })

from rest_framework import viewsets
from .models import Paciente
from .serializers import PacienteSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
