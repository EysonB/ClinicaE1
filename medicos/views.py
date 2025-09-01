from django.shortcuts import render, redirect
from .forms import MedicoForm
from .models import Medico

def medico_list(request):
    medicos = Medico.objects.all()
    return render(request, 'medicos/medico_list.html', {'medicos': medicos})

def medico_create(request):
    if request.method == 'POST':
        form = MedicoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('medicos:medico_list')
    else:
        form = MedicoForm()
    return render(request, 'medicos/medico_form.html', {'form': form})
