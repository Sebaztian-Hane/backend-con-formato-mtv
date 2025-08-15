from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from models.models import Permission
from forms.forms import PermissionForm

@login_required
def permission_list(request):
    permissions = Permission.objects.all()
    return render(request, 'permissions/permission_list.html', {'permissions': permissions})

@login_required
def permission_detail(request, pk):
    permission = get_object_or_404(Permission, pk=pk)
    return render(request, 'permissions/permission_detail.html', {'permission': permission})

@login_required
def permission_create(request):
    if request.method == 'POST':
        form = PermissionForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Permiso creado exitosamente.')
            return redirect('permissions:permission_list')
    else:
        form = PermissionForm()
    return render(request, 'permissions/permission_form.html', {'form': form})

@login_required
def permission_update(request, pk):
    permission = get_object_or_404(Permission, pk=pk)
    if request.method == 'POST':
        form = PermissionForm(request.POST, instance=permission)
        if form.is_valid():
            form.save()
            messages.success(request, 'Permiso actualizado exitosamente.')
            return redirect('permissions:permission_list')
    else:
        form = PermissionForm(instance=permission)
    return render(request, 'permissions/permission_form.html', {'form': form})

@login_required
def permission_delete(request, pk):
    permission = get_object_or_404(Permission, pk=pk)
    if request.method == 'POST':
        permission.delete()
        messages.success(request, 'Permiso eliminado exitosamente.')
        return redirect('permissions:permission_list')
    return render(request, 'permissions/permission_confirm_delete.html', {'permission': permission})
