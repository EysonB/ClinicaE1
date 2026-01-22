from django import forms    
from .models import Paciente

class PacienteForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['nombre', 'apellido', 'cedula', 'fecha_nacimiento', 'email', 'telefono']
        widgets = {
            'fecha_nacimiento': forms.DateInput(
                attrs={'type': 'date'}  # Esto hace que aparezca un cuadro de fecha
            ),
        }