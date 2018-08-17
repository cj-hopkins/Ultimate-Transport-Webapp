=========Ultimate Transport App=========

To view the web application visit 'ultimate-transport.win' or install using the below instructions.

===============================
Installation (via terminal):

~~ Clone the repository using one of the links below:
	
	SSH: git@git.ucd.ie:Conor2/ultimate_transport.git
	HTTPS: https://git.ucd.ie/Conor2/ultimate_transport.git

~~ Activate your conda environment

~~ Navigate to the project folder and install the required modules using the commands below:
	
	'cd ultimate_transport'
	'pip install -r requirements.txt'

~~ Navigate to the React folder and install the required node modules using the commands below:

	'cd src/react-ui'
	'npm install'

~~ Run the Django server using the command below:
	
	'python ../manage.py runserver'

~~ Start the NodeJS server (separate terminal tab/window) using the command below: 
	
	'npm start'

~~ The project should now be running locally!

~~ Visit localhost:3000 in browser to view!


*** NodeJs is required to run the application locally. It can be downloaded from the link below:
	
	https://nodejs.org/en/

----------------------====
Development:

~~ The Django server typically does not need to be restarted

~~ Check package.json for React scripts and entry points. Scripts can be accessed by prefixing them with npm run
