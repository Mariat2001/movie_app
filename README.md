<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center">Movie App</h1>
</p>


<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>
<hr>

##  Getting start

1. Clone the FirebaseUploadImage repository:

```sh
git clone https://github.com/Mariat2001/FirebaseUploadImage
```
2. Change to the project directory:

```sh
cd FirebaseUploadImage
```
  A-***React Setup***
  
1. Install the dependencies:

```sh
npm install
```
  B-***Firebase Setup***

```sh
1.npm install
```

```sh
2. Create a New Project
```

```sh
3. Set Up Authentication
.In the Firebase Console, navigate to "Authentication" in the left sidebar.
.Under "Sign-in method" tab, enable the "Email/Password" sign-in method.
```

```sh
4. Configure Storage Rules
.Go to "Storage" in the Firebase Console.
.Choose "Production" mode .
.Replace the existing rules with the following:
 service firebase.storage {
  match /b/{bucket}/o {
    // Allow read and write access to the user's own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

```

```sh
5. Setup Firebase in Your Project
.Go to "Project settings" (gear icon) in the Firebase Console.
.Under "Your apps" section, click on "</>" to add a new app platform.
.Choose the appropriate platform (e.g., Web) and give your app a nickname.
.Follow the setup instructions, which typically involve adding Firebase SDK to your project.
```

```sh
6. Install Firebase SDK
In your project's terminal, run the following command to install Firebase SDK using npm:
    npm install firebase

```

```sh
7. Configure Firebase in Your Code
Replace the Firebase configuration in your project with the provided firebaseConfig object:
javascript
Copy code
const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket>",
  messagingSenderId: "<your-messaging-sender-id>",
  appId: "<your-app-id>",
  measurementId: "<your-measurement-id>"
}
```
