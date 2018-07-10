import os

if os.environ.get('DJANGO_PRODUCTION') is not None:
        print("Using production settings")
        from ultimate_transport.production_settings import * 
else:
    print("Using development settings")
    from ultimate_transport.development_settings import *

