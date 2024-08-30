from django.contrib import admin

from .models import user
from .models import puzzle
from .models import guest
from .models import localsol
from .models import savedpuzzle

admin.site.register(user)
admin.site.register(guest)
admin.site.register(puzzle)
admin.site.register(localsol)
admin.site.register(savedpuzzle)

