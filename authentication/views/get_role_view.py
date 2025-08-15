from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.services.get_role_service import GetRoleService

class GetRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = GetRoleService.get_user_roles_and_perms(user)
        return Response(data)
