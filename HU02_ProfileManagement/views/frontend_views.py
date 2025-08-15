from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from HU02_ProfileManagement.users.models import CustomUser

@login_required
def hu02_view(request):
    user = request.user

    return render(request, 'hu02.html', {
        'user': user,
    })
