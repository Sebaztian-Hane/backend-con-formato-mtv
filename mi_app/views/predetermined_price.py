import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from ..models import PredeterminedPrice

@csrf_exempt
def predetermined_prices_list(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])
    
    qs = PredeterminedPrice.objects.filter(deleted_at__isnull=True)
    data = [{
        "id": p.id,
        "name": p.name,
        "price": str(p.price)
    } for p in qs]
    return JsonResponse({"predetermined_prices": data})


@csrf_exempt
def predetermined_price_create(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    
    try:
        payload = json.loads(request.body.decode())
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    
    name = payload.get("name")
    price = payload.get("price")

    if not name or price is None:
        return JsonResponse({"error": "Campos obligatorios faltantes"}, status=400)
    
    p = PredeterminedPrice.objects.create(name=name, price=price)
    return JsonResponse({"id": p.id}, status=201)


@csrf_exempt
def predetermined_price_update(request, pk):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    
    try:
        payload = json.loads(request.body.decode())
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    
    try:
        p = PredeterminedPrice.objects.filter(deleted_at__isnull=True).get(pk=pk)
    except PredeterminedPrice.DoesNotExist:
        return JsonResponse({"error": "No encontrado"}, status=404)
    
    name = payload.get("name")
    price = payload.get("price")

    if name is not None:
        p.name = name
    if price is not None:
        p.price = price
    
    p.save()
    return JsonResponse({
        "id": p.id,
        "name": p.name,
        "price": str(p.price)
    })


@csrf_exempt
def predetermined_price_delete(request, pk):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    
    try:
        p = PredeterminedPrice.objects.filter(deleted_at__isnull=True).get(pk=pk)
    except PredeterminedPrice.DoesNotExist:
        return JsonResponse({"error": "No encontrado"}, status=404)
    
    p.soft_delete()
    return JsonResponse({"status": "deleted"})
