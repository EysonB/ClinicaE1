from django.http import JsonResponse
from .models import Paciente

def pacientes_api(request):
    pacientes = list(Paciente.objects.values())
    return JsonResponse(pacientes, safe=False)
