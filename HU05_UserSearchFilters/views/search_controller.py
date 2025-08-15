from django.core.paginator import Paginator
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from HU05_UserSearchFilters.requests.search_users_form import SearchUsersForm

User = get_user_model()

def search_users_view(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Método no permitido'}, status=405)

    form = SearchUsersForm(request.GET)
    validation_errors = form.validate_or_error_response()
    if validation_errors:
        return JsonResponse(validation_errors, status=422)

    search = form.cleaned_data['search']
    per_page = form.cleaned_data['per_page']
    page = form.cleaned_data.get('page', 1)
    email = form.cleaned_data.get('email')
    documento = form.cleaned_data.get('documento')
    rol = form.cleaned_data.get('rol')

    queryset = User.objects.filter(username__icontains=search)

    if email:
        queryset = queryset.filter(email__icontains=email)
    if documento:
        queryset = queryset.filter(profile__documento__icontains=documento)
    if rol:
        queryset = queryset.filter(profile__rol__iexact=rol)

    paginator = Paginator(queryset, per_page)
    try:
        paginated = paginator.page(page)
    except:
        return JsonResponse({'message': f'La página {page} no existe.'}, status=404)

    results = [{
        'id': u.id,
        'username': u.username,
        'email': u.email
    } for u in paginated.object_list]

    if not results:
        return JsonResponse({'message': 'No se encontraron resultados con los filtros proporcionados.'}, status=200)

    return JsonResponse({
        'message': 'OK',
        'total': paginator.count,
        'page': page,
        'per_page': per_page,
        'results': results
    }, status=200)

