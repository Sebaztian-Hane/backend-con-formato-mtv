from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from patients.models import Patient

class DocumentTypeList(APIView):
    def get(self, request):
        data = [
            {'id': i, 'value': value, 'name': label}
            for i, (value, label) in enumerate(Patient.DOCUMENT_TYPE_CHOICES)
        ]
        return Response(data, status=status.HTTP_200_OK)
