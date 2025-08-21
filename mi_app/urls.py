from django.urls import path
from .views import histories, document_types, payment_types, predetermined_prices

urlpatterns = [
    path("histories/", histories.histories_list, name="histories_list"),
    path("histories/create/", histories.history_create, name="history_create"),
    path("histories/<int:pk>/update/", histories.history_update, name="history_update"),
    path("histories/<int:pk>/delete/", histories.history_delete, name="history_delete"),

    path("document-types/", document_types.document_types_list, name="document_types_list"),
    path("document-types/create/", document_types.document_type_create, name="document_type_create"),
    path("document-types/<int:pk>/update/", document_types.document_type_update, name="document_type_update"),
    path("document-types/<int:pk>/delete/", document_types.document_type_delete, name="document_type_delete"),

    path("payment-types/", payment_types.payment_types_list, name="payment_types_list"),
    path("payment-types/create/", payment_types.payment_type_create, name="payment_type_create"),
    path("payment-types/<int:pk>/update/", payment_types.payment_type_update, name="payment_type_update"),
    path("payment-types/<int:pk>/delete/", payment_types.payment_type_delete, name="payment_type_delete"),

    path("predetermined-prices/", predetermined_prices.predetermined_prices_list, name="predetermined_prices_list"),
    path("predetermined-prices/create/", predetermined_prices.predetermined_price_create, name="predetermined_price_create"),
    path("predetermined-prices/<int:pk>/update/", predetermined_prices.predetermined_price_update, name="predetermined_price_update"),
    path("predetermined-prices/<int:pk>/delete/", predetermined_prices.predetermined_price_delete, name="predetermined_price_delete"),
]
