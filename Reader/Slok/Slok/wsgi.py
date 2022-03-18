"""
WSGI config for Slok project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import os
import dj_static

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Reader.Slok.Slok.settings')
from django.core.wsgi import get_wsgi_application

from dj_static import Cling
application = Cling(get_wsgi_application())
