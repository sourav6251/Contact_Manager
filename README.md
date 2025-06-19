# Contact Manager Web Application

A comprehensive contact management system that allows users to securely store, organize, and share their contacts. The application features user authentication, email verification, contact sharing with OTP protection, and profile management.

## Key Features

- 🔐 **User Authentication**: Secure registration and login
- ✉️ **Email Verification**: Mandatory verification before adding contacts
- 👥 **Contact Management**: Add, view, edit, and manage contacts
- 🔗 **Secure Sharing**: Share contacts via links protected with 6-digit OTP
- 🔒 **Account Security**: Multiple password update options and account deletion
- 📸 **Profile Management**: Update profile photo and personal information
- ⏳ **Expiring Links**: Set expiration times for shared contacts

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL with Spring Data JPA
- **File Storage**: ImageKit for profile photos
- **Email**: Java Mail Sender for verification emails
- **API**: RESTful architecture

### Frontend
- **Language**: TypeScript
- **Framework**: React 18
- **Routing**: React Router 6
- **State Management**: Context API
- **UI**: Custom CSS components

## Installation Guide

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- ImageKit account (for media storage)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/contact-manager.git
   cd contact-manager/backend
   ```
2. Configure application properties:
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/contact_db
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password
   jwt.secret=your_jwt_secret_key
   imagekit.private-key=your_imagekit_private_key
   imagekit.public-key=your_imagekit_public_key
   mail.username=your_email@gmail.com
   mail.password=your_email_password
   ```
3. Build and run:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```env
   # .env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_IMAGEKIT_URL=https://ik.imagekit.io/your_id
   ```
4. Start development server:
   ```bash
   npm start
   ```

## Screenshots

### Authentication

![User Login Interface](https://ik.imagekit.io/eur1zq65p/Contact/Login.png)
- [Login](https://ik.imagekit.io/eur1zq65p/Contact/Login.png): User login interface
- [Signup](https://ik.imagekit.io/eur1zq65p/Contact/Signup.png): New user registration

### Contact Management
- [Contact Management](https://ik.imagekit.io/eur1zq65p/Contact/Contact.png): Main contact management interface
- [Edit Contact](https://ik.imagekit.io/eur1zq65p/Contact/EditContact.png): Adding/editing a contact

### Contact Sharing
 ![Share Contact](https://ik.imagekit.io/eur1zq65p/Contact/ShareContactView.png )
- [Share Contact](https://ik.imagekit.io/eur1zq65p/Contact/ShareContactView.png): Generating a secure share link
- [Share View](https://ik.imagekit.io/eur1zq65p/Contact/ShareContact.png  ): Viewing a shared contact

### Account Settings
- [Profile](https://ik.imagekit.io/eur1zq65p/Contact/Profile.png): User profile overview
- [Update Profile](https://ik.imagekit.io/eur1zq65p/Contact/UpdateProfile.png): Updating profile information
- [Verify Profile](https://ik.imagekit.io/eur1zq65p/Contact/VerifyProfile.png): Email verification interface

### Security Features
- [Update Password](https://ik.imagekit.io/eur1zq65p/Contact/UpdatePassword.png): Changing password with current credentials
- [Update Password OTP](https://ik.imagekit.io/eur1zq65p/Contact/UpdatePasswordOTP.png): Password update via OTP verification
- [Delete Account](https://ik.imagekit.io/eur1zq65p/Contact/DeleteAccount.png): Account deletion confirmation

### Shared Contact View
 ![Shared Contact View](https://ik.imagekit.io/eur1zq65p/Contact/ShareView.png)
- [Shared Contact View](https://ik.imagekit.io/eur1zq65p/Contact/ShareView.png): Viewing shared contact details with OTP protection

## Usage Guide
1. **Registration**: Create a new account with email and password
2. **Verification**: Check your email for verification link
3. **Login**: Access your dashboard after verification
4. **Add Contacts**: Click "Add Contact" to create new entries
5. **Share Contacts**: Select a contact and generate secure share link
6. **Manage Profile**: Update your name, profile photo, or password in Settings
7. **Secure Sharing**: Recipients need OTP to view shared contacts

## API Endpoints

### Unprotected Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/register` | POST | User registration |
| `/login` | GET | User login |
| `/logout` | GET | User logout |
| `/upload` | POST | Upload profile photo |
| `/delete/{ID}` | GET | Delete uploaded file |
| `/verifysharecontact` | GET | Verify shared contact with OTP |

### Protected Endpoints (`/secure`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Secure authentication check |
| `/generateotp/{userID}` | GET | Generate OTP for verification |
| `/verifyotpuserId` | GET | Verify OTP |
| `/showuser` | GET | Show current user details |
| `/showuserbyid/{userID}` | GET | Show user by ID |
| `/updateprofile/{userID}` | PUT | Update user profile |
| `/updateoldpassword/{userID}` | PUT | Update password with old password |
| `/updatepassword/{userID}` | PUT | Update password |
| `/deleteuser/{userID}` | DELETE | Delete user account |
| `/isverified/{userID}` | GET | Check if profile is verified |
| `/createcontact/{userID}` | POST | Create new contact |
| `/updatecontact/{userID}` | PUT | Update contact |
| `/showallcontact/{userID}` | GET | Show all contacts |
| `/deletecontact/{userID}` | DELETE | Delete contact |
| `/contactpage` | GET | Paginated contact list |
| `/activatesharecontact/{userID}` | GET | Activate contact sharing |
| `/deletesharecontact/{userID}` | GET | Delete shared contact |

## Frontend Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Login page |
| `/feature` | Feature page |
| `/contact/share/:contactId` | Share contact page |
| `/contact/sharen` | Share contact error page |
| `/about` | About page (Protected) |
| `/logout` | Logout page (Protected) |
| `/contacts` | Contact management page (Protected) |
| `/profile` | User profile page (Protected) |
| `/tags` | Tags management page (Protected) |
| `/settings` | Settings page (Protected) |
| `*` | Redirects to landing page |

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request