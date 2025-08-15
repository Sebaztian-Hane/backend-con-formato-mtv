from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

@login_required
def hu02_view(request):
    user = request.user

    if request.method == 'POST':
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)

        if 'photo' in request.FILES:
            user.photo = request.FILES['photo']  # ✅ guardar la imagen

        user.save()
        return redirect('hu02')

    return render(request, 'hu02.html', {
        'user': user
    })
