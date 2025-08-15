from django.urls import path
from . import views

urlpatterns = [
    # Rutas para DocumentType
    path('document-types/', views.document_types_list, name='document_types_list'),  
    # Tipos de documento

    path('document-types/new/', views.document_type_create, name='document_type_create'),  
    # Formulario para crear un nuevo tipo de documento

    path('document-types/<int:pk>/edit/', views.document_type_update, name='document_type_update'),  
    # Formulario para editar un tipo de documento existente.

    path('document-types/<int:pk>/delete/', views.document_type_delete, name='document_type_delete'),  
    # Acción para borrar un tipo de documento


    # Rutas para Patient
    path('patients/', views.patients_list, name='patients_list'),  
    # Lista todos los pacientes

    path('patients/new/', views.patient_create, name='patient_create'),  
    # Formulario para crear un nuevo paciente

    path('patients/<int:pk>/edit/', views.patient_update, name='patient_update'),  
    # Editar paciente existente

    path('patients/<int:pk>/delete/', views.patient_delete, name='patient_delete'),  
    # Eliminar paciente


    # Rutas para History
    path('histories/', views.histories_list, name='histories_list'),  
    # Lista historias clínicas

    path('histories/new/', views.history_create, name='history_create'),  
    # Crear historia clínica

    path('histories/<int:pk>/edit/', views.history_update, name='history_update'),  
    # Editar historia clínica

    path('histories/<int:pk>/delete/', views.history_delete, name='history_delete'),  
    # Eliminar historia clínica (borrado lógico)


    # Rutas para PaymentType
    path('payment-types/', views.payment_types_list, name='payment_types_list'),  
    # Lista tipos de pago

    path('payment-types/new/', views.payment_type_create, name='payment_type_create'),  
    # Crear tipo de pago

    path('payment-types/<int:pk>/edit/', views.payment_type_update, name='payment_type_update'),  
    # Editar tipo de pago

    path('payment-types/<int:pk>/delete/', views.payment_type_delete, name='payment_type_delete'),  
    # Eliminar tipo de pago


    # Rutas para PredeterminedPrice
    path('predetermined-prices/', views.predetermined_prices_list, name='predetermined_prices_list'),  
    # Lista precios predeterminados

    path('predetermined-prices/new/', views.predetermined_price_create, name='predetermined_price_create'),  
    # Crear precio predeterminado

    path('predetermined-prices/<int:pk>/edit/', views.predetermined_price_update, name='predetermined_price_update'),  
    # Editar precio predeterminado

    path('predetermined-prices/<int:pk>/delete/', views.predetermined_price_delete, name='predetermined_price_delete'),  
    # Eliminar precio predeterminado


    # Rutas para Appointment
    path('appointments/', views.appointments_list, name='appointments_list'),  
    # Lista citas médicas

    path('appointments/new/', views.appointment_create, name='appointment_create'),  
    # Crear cita

    path('appointments/<int:pk>/edit/', views.appointment_update, name='appointment_update'),  
    # Editar cita

    path('appointments/<int:pk>/delete/', views.appointment_delete, name='appointment_delete'),  
    # Eliminar cita
]