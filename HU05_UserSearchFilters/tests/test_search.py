import pytest
from django.test import TestCase
from HU05_UserSearchFilters.requests.search_users_form import SearchUsersForm

class SearchUsersFormTest(TestCase):

    def test_form_valido(self):
        form_data = {
            'search': 'juan',
            'per_page': 10,
            'page': 1,
            'email': 'juan@example.com',
            'documento': '12345678',
            'rol': 'admin',
        }
        form = SearchUsersForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_invalido_por_per_page_alto(self):
        form_data = {
            'search': 'juan',
            'per_page': 500
        }
        form = SearchUsersForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('per_page', form.errors)

    def test_form_invalido_por_search_mal_formado(self):
        form_data = {
            'search': '!!!###@@',
            'per_page': 10
        }
        form = SearchUsersForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('search', form.errors)

    # ✅ Nuevos tests agregados:
    def test_falta_campo_search(self):
        form_data = {'per_page': 10}
        form = SearchUsersForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('search', form.errors)

    def test_per_page_invalido_no_entero(self):
        form_data = {'search': 'juan', 'per_page': 'abc'}
        form = SearchUsersForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('per_page', form.errors)

    def test_page_menor_a_uno(self):
        form_data = {'search': 'juan', 'per_page': 10, 'page': 0}
        form = SearchUsersForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('page', form.errors)

    def test_email_invalido(self):
        form_data = {'search': 'juan', 'per_page': 10, 'email': 'no-es-email'}
        form = SearchUsersForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)

    def test_validate_or_error_response_devuelve_errores(self):
        form_data = {'per_page': 10}
        form = SearchUsersForm(data=form_data)
        error_response = form.validate_or_error_response()
        self.assertIsNotNone(error_response)
        self.assertIn('errors', error_response)
