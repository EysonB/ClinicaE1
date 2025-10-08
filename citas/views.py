from django.shortcuts import render, redirect, get_object_or_404
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

def cita_edit(request, pk):
    cita = get_object_or_404(Cita, pk=pk)
    if request.method == 'POST':
        form = CitaForm(request.POST, instance=cita)
        if form.is_valid():
            form.save()
            return redirect('citas:cita_list')
    else:
        form = CitaForm(instance=cita)
    return render(request, 'citas/cita_form.html', {'form': form})

def cita_delete(request, pk):
    cita = get_object_or_404(Cita, pk=pk)
    if request.method == 'POST':
        cita.delete()
        return redirect('citas:cita_list')
    return render(request, 'citas/cita_confirm_delete.html', {'cita': cita})
