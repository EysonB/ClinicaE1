from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from medicos.models import Medico


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email y contraseña son requeridos'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        usuario = Usuario.objects.get(email=email, activo=True)
    except Usuario.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    if not usuario.check_password(password):
        return Response(
            {'error': 'Contraseña incorrecta'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

    user_data = {
        'id': usuario.id,
        'nombre': usuario.nombre,
        'email': usuario.email,
        'rol': usuario.rol,
    }

    if usuario.rol == 'medico':
        if usuario.medico_id is None:
            return Response(
                {'error': 'El médico vinculado no existe. Contacte al administrador.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        user_data['medico_id'] = usuario.medico.id

    return Response({
        'user': user_data,
        'message': f'Bienvenido {usuario.nombre}'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def logout_view(request):
    return Response({
        'message': 'Sesión cerrada correctamente'
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def usuarios_list_create(request):
    if request.method == 'GET':
        usuarios = Usuario.objects.all().order_by('nombre')
        data = []
        for u in usuarios:
            data.append({
                'id': u.id,
                'nombre': u.nombre,
                'email': u.email,
                'rol': u.rol,
                'activo': u.activo,
                'medico_id': u.medico_id,
                'medico_nombre': f"{u.medico.nombre} {u.medico.apellido}" if u.medico else None,
                'created_at': u.created_at,
            })
        return Response(data)

    if request.method == 'POST':
        nombre = request.data.get('nombre')
        email = request.data.get('email')
        password = request.data.get('password')
        rol = request.data.get('rol')
        medico_id = request.data.get('medico_id')

        if not all([nombre, email, password, rol]):
            return Response(
                {'error': 'Nombre, email, contraseña y rol son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Usuario.objects.filter(email=email).exists():
            return Response(
                {'error': 'Ya existe un usuario con ese email'},
                status=status.HTTP_400_BAD_REQUEST
            )

        medico = None
        if rol == 'medico':
            if not medico_id:
                return Response(
                    {'error': 'Debe seleccionar un médico para este rol'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                medico = Medico.objects.get(id=medico_id)
                if hasattr(medico, 'usuario'):
                    return Response(
                        {'error': 'Este médico ya tiene un usuario asignado'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Medico.DoesNotExist:
                return Response(
                    {'error': 'El médico seleccionado no existe'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        usuario = Usuario(nombre=nombre, email=email, rol=rol, medico=medico)
        usuario.set_password(password)
        usuario.save()

        return Response({
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'rol': usuario.rol,
            'activo': usuario.activo,
        }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def usuario_detail(request, pk):
    try:
        usuario = Usuario.objects.get(pk=pk)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'rol': usuario.rol,
            'activo': usuario.activo,
            'medico_id': usuario.medico_id,
        })

    if request.method == 'PUT':
        nombre = request.data.get('nombre', usuario.nombre)
        email = request.data.get('email', usuario.email)
        rol = request.data.get('rol', usuario.rol)
        medico_id = request.data.get('medico_id')
        password = request.data.get('password')
        activo = request.data.get('activo', usuario.activo)

        if email != usuario.email and Usuario.objects.filter(email=email).exists():
            return Response(
                {'error': 'Ya existe un usuario con ese email'},
                status=status.HTTP_400_BAD_REQUEST
            )

        medico = None
        if rol == 'medico':
            if not medico_id:
                return Response(
                    {'error': 'Debe seleccionar un médico para este rol'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                medico = Medico.objects.get(id=medico_id)
                if hasattr(medico, 'usuario') and medico.usuario.id != usuario.id:
                    return Response(
                        {'error': 'Este médico ya tiene un usuario asignado'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Medico.DoesNotExist:
                return Response(
                    {'error': 'El médico seleccionado no existe'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        usuario.nombre = nombre
        usuario.email = email
        usuario.rol = rol
        usuario.medico = medico
        usuario.activo = activo

        if password:
            usuario.set_password(password)
        else:
            usuario.save()

        usuario.save()

        return Response({
            'id': usuario.id,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'rol': usuario.rol,
            'activo': usuario.activo,
        })

    if request.method == 'DELETE':
        usuario.activo = False
        usuario.save()
        return Response({'message': 'Usuario desactivado correctamente'})