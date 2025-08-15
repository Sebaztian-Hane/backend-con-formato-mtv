from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from models.models import Role
from forms.forms import RoleForm

@login_required
def role_list(request):
    roles = Role.objects.all()
    return render(request, 'roles/role_list.html', {'roles': roles})

@login_required
def role_detail(request, pk):
    role = get_object_or_404(Role, pk=pk)
    return render(request, 'roles/role_detail.html', {'role': role})

@login_required
def role_create(request):
    if request.method == 'POST':
        form = RoleForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Rol creado exitosamente.')
            return redirect('roles:role_list')
    else:
        form = RoleForm()
    return render(request, 'roles/role_form.html', {'form': form})

@login_required
def role_update(request, pk):
    role = get_object_or_404(Role, pk=pk)
    if request.method == 'POST':
        form = RoleForm(request.POST, instance=role)
        if form.is_valid():
            form.save()
            messages.success(request, 'Rol actualizado exitosamente.')
            return redirect('roles:role_list')
    else:
        form = RoleForm(instance=role)
    return render(request, 'roles/role_form.html', {'form': form})

@login_required
def role_delete(request, pk):
    role = get_object_or_404(Role, pk=pk)
    if request.method == 'POST':
        role.delete()
        messages.success(request, 'Rol eliminado exitosamente.')
        return redirect('roles:role_list')
    return render(request, 'roles/role_confirm_delete.html', {'role': role})
