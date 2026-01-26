from rest_framework import serializers
from .models import Factura
from atenciones.models import Atencion


class FacturaSerializer(serializers.ModelSerializer):
    # Información de la atención
    atencion_id = serializers.IntegerField(source='atencion.id', read_only=True)
    paciente_nombre = serializers.CharField(source='atencion.paciente.nombre', read_only=True)
    paciente_apellido = serializers.CharField(source='atencion.paciente.apellido', read_only=True)
    paciente_cedula = serializers.CharField(source='atencion.paciente.cedula', read_only=True)
    medico_nombre = serializers.CharField(source='atencion.medico.nombre', read_only=True)
    medico_apellido = serializers.CharField(source='atencion.medico.apellido', read_only=True)
    diagnostico = serializers.CharField(source='atencion.diagnostico', read_only=True)
    
    class Meta:
        model = Factura
        fields = [
            'id',
            'atencion',
            'numero_factura',
            'monto',
            'metodo_pago',
            'fecha_emision',
            # Campos extras
            'atencion_id',
            'paciente_nombre',
            'paciente_apellido',
            'paciente_cedula',
            'medico_nombre',
            'medico_apellido',
            'diagnostico',
        ]
        read_only_fields = ['numero_factura', 'fecha_emision']

    def validate_atencion(self, value):
        """Validar que la atención no tenga ya factura"""
        if self.instance is None:  # Solo en creación
            if hasattr(value, 'factura'):
                raise serializers.ValidationError("Esta atención ya tiene una factura.")
            if value.estado_pago == 'pagado':
                raise serializers.ValidationError("Esta atención ya está marcada como pagada.")
        return value

    def validate(self, data):
        """Validar que el monto coincida con el de la atención"""
        if 'atencion' in data and 'monto' in data:
            if data['monto'] != data['atencion'].monto:
                raise serializers.ValidationError(
                    {"monto": "El monto debe coincidir con el monto de la atención."}
                )
        return data


class FacturaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar facturas"""
    paciente_nombre_completo = serializers.SerializerMethodField()
    
    class Meta:
        model = Factura
        fields = [
            'id',
            'numero_factura',
            'paciente_nombre_completo',
            'monto',
            'metodo_pago',
            'fecha_emision',
        ]

    def get_paciente_nombre_completo(self, obj):
        return f"{obj.atencion.paciente.nombre} {obj.atencion.paciente.apellido}"