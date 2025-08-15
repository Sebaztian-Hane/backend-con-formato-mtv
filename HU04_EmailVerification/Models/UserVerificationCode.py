# Models/UserVerificationCode.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class UserVerificationCode(models.Model):
    """
    Código de verificación asociado a un usuario.
    Campos:
      - user: FK al usuario (settings.AUTH_USER_MODEL)
      - code: cadena del código (6-10 chars)
      - expires_at: cuándo expira
      - failed_attempts: contador de intentos fallidos
      - locked_until: hasta cuándo está bloqueado por intentos
      - created_at / updated_at
    """

    class Meta:
        db_table = "user_verification_code"
        app_label = "Models"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "code"]),
            models.Index(fields=["expires_at"]),
        ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="verification_codes",
        help_text="Usuario propietario del código",
    )
    code = models.CharField(max_length=10, help_text="Código de verificación")
    expires_at = models.DateTimeField(help_text="Fecha y hora de expiración")
    failed_attempts = models.PositiveIntegerField(default=0, help_text="Intentos fallidos")
    locked_until = models.DateTimeField(null=True, blank=True, help_text="Si está bloqueado, hasta cuándo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        # Evita mostrar emails sensibles en logs si lo prefieres; aquí es útil para debug
        user_email = getattr(self.user, "email", str(self.user))
        return f"{user_email} — {self.code} (expira: {self.expires_at})"

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def is_locked(self) -> bool:
        """Devuelve True si ahora mismo está bloqueado por demasiados intentos."""
        return bool(self.locked_until and timezone.now() < self.locked_until)

    def increment_failed_attempts(self, lock_threshold: int = 3, lock_minutes: int = 10) -> None:
        """
        Incrementa failed_attempts y aplica bloqueo si supera threshold.
        Guarda el modelo al final.
        """
        self.failed_attempts = (self.failed_attempts or 0) + 1
        if self.failed_attempts >= lock_threshold:
            self.locked_until = timezone.now() + timedelta(minutes=lock_minutes)
        self.save(update_fields=["failed_attempts", "locked_until", "updated_at"])
