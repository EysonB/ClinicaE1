from rest_framework import serializers
from .models import Atencion
from pacientes.models import Paciente
from medicos.models import Medico
from citas.models import Cita


class AtencionSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar nombres
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='paciente.apellido', read_only=True)
    paciente_cedula = serializers.CharField(source='paciente.cedula', read_only=True)
    
    medico_nombre = serializers.CharField(source='medico.nombre', read_only=True)
    medico_apellido = serializers.CharField(source='medico.apellido', read_only=True)
    medico_especialidad = serializers.CharField(source='medico.especialidad', read_only=True)
    
    cita_fecha = serializers.DateField(source='cita.fecha', read_only=True)
    cita_hora = serializers.TimeField(source='cita.hora', read_only=True)
    
    # Para saber si ya tiene factura
    tiene_factura = serializers.SerializerMethodField()

    class Meta:
        model = Atencion
        fields = [
            'id',
            'cita',
            'medico',
            'paciente',
            'diagnostico',
            'tratamiento',
            'observaciones',
            'monto',
            'estado_pago',
            'fecha_atencion',
            'fecha_creacion',
            # Campos extras
            'paciente_nombre',
            'paciente_apellido',
            'paciente_cedula',
            'medico_nombre',
            'medico_apellido',
            'medico_especialidad',
            'cita_fecha',
            'cita_hora',
            'tiene_factura',
        ]
        read_only_fields = ['fecha_creacion']

    def get_tiene_factura(self, obj):
        return hasattr(obj, 'factura')

    def validate_cita(self, value):
        """Validar que la cita no tenga ya una atención"""
        if self.instance is None:  # Solo en creación
            if hasattr(value, 'atencion'):
                raise serializers.ValidationError("Esta cita ya tiene una atención registrada.")
        return value

    def validate_monto(self, value):
        """Validar que el monto sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0.")
        return value


class AtencionListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar atenciones"""
    paciente_nombre_completo = serializers.SerializerMethodField()
    medico_nombre_completo = serializers.SerializerMethodField()
    
    class Meta:
        model = Atencion
        fields = [
            'id',
            'paciente_nombre_completo',
            'medico_nombre_completo',
            'diagnostico',
            'monto',
            'estado_pago',
            'fecha_atencion',
        ]

    def get_paciente_nombre_completo(self, obj):
        return f"{obj.paciente.nombre} {obj.paciente.apellido}"

    def get_medico_nombre_completo(self, obj):
        return f"Dr. {obj.medico.nombre} {obj.medico.apellido}"