from django.urls import path
from HU05_UserSearchFilters.views.search_controller import search_users_view
from HU05_UserSearchFilters.views.search_html_view import search_users_html_view

urlpatterns = [
    # Vista API que devuelve resultados en JSON
    path('search/', search_users_view, name='search_users'),
    path('', search_users_view),  # para GET /api/users

    # Vista HTML para probar con un formulario en navegador
    path('html/', search_users_html_view, name='search_users_html'),
]