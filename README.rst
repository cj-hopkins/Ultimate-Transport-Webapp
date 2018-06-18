Installation:

~~ Clone the repository

~~ Activate your conda environment

~~ cd ultimate_transport && pip install -r requirements.txt

~~ cd src/reactify-ui && npm install

~~ npm run collect

~~ ../manage.py runserver

----------------------
Development:

~~ each time you make a change to App.js, you must rerun npm run collect

~~ The Django server typically does not need to be restarted

~~ Check package.json for React scripts and entry points. Scripts can be accessed by prefixing them with npm run
