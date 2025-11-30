rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Books collection - read by all, write by admin only
    match /books/{bookId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isOwner(userId);
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Favorites collection - FIXED
    match /favorites/{favoriteId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Reading goals collection
    match /goals/{goalId} {
      allow read, write: if isSignedIn() && 
        (request.resource.data.userId == request.auth.uid || resource.data.userId == request.auth.uid);
    }
    
    // Reading progress collection
    match /reading_progress/{progressId} {
      allow read, write: if isSignedIn() && 
        (request.resource.data.userId == request.auth.uid || resource.data.userId == request.auth.uid);
    }
    
    // Contact forms - NEW
    match /contacts/{contactId} {
      allow create: if true;  // Anyone can submit
      allow read, update, delete: if isAdmin();  // Only admins can manage
    }
  }
}
