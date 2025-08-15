from django.shortcuts import render
from django.core.paginator import Paginator
from django.contrib.auth import get_user_model
from HU05_UserSearchFilters.requests.search_users_form import SearchUsersForm

User = get_user_model()

def search_users_html_view(request):
    form = SearchUsersForm(request.GET or None)
    results = []

    if request.GET and form.is_valid():
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
            results = paginated.object_list
        except:
            results = []

    return render(request, 'hu05_search.html', {
        'form': form,
        'results': results
    })
