from rest_framework import serializers
from .models import Cita
from pacientes.models import Paciente
from medicos.models import Medico

class CitaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    medico_nombre = serializers.CharField(source='medico.nombre', read_only=True)

    class Meta:
        model = Cita
        fields = ['id', 'paciente', 'paciente_nombre', 'medico', 'medico_nombre', 'fecha', 'hora', 'motivo']
