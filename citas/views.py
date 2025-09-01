from django.shortcuts import render, redirect
from .models import Cita
from .forms import CitaForm

def cita_list(request):
    citas = Cita.objects.all()
    return render(request, 'citas/cita_list.html', {'citas': citas})

def cita_create(request):
    if request.method == 'POST':
        form = CitaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('citas:cita_list')
    else:
        form = CitaForm()
    return render(request, 'citas/cita_form.html', {'form': form})
