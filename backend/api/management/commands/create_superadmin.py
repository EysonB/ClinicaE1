from django.core.management.base import BaseCommand
from api.models import Usuario

class Command(BaseCommand):
    help = 'Crea el usuario superadmin'

    def handle(self, *args, **kwargs):
        if Usuario.objects.filter(email='admin@clinica.com').exists():
            self.stdout.write(self.style.WARNING('⚠️  Superadmin ya existe'))
            return

        admin = Usuario(
            nombre='Administrador',
            email='admin@clinica.com',
            rol='superadmin'
        )
        admin.set_password('admin123')
        admin.save()
        
        self.stdout.write(self.style.SUCCESS('✅ Superadmin creado exitosamente'))
        self.stdout.write(self.style.SUCCESS('   Email: admin@clinica.com'))
        self.stdout.write(self.style.SUCCESS('   Password: admin123'))