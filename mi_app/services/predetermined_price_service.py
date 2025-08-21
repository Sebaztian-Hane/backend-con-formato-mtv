from ..models import PredeterminedPrice

def list_active():
    return PredeterminedPrice.objects.filter(deleted_at__isnull=True)

def create(**kwargs):
    return PredeterminedPrice.objects.create(**kwargs)

def update(instance: PredeterminedPrice, **kwargs):
    for k, v in kwargs.items():
        setattr(instance, k, v)
    instance.save()
    return instance

def soft_delete(instance: PredeterminedPrice):
    instance.soft_delete()
    return instance
