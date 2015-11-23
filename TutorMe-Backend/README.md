# TutorMe API Documentation

## Call Styling
Calls should be made via their appropriate API handles with JSON bodies in the request. Fields consumed will be listed in the documentation, extraenous fields will be stripped/ignored.

## - <root>
### index `[http/https get]`
    /
Redirects to CAS Authentication, but contextually serves the appropriate site page for web browsers on successful authentication. iOS should ignore redirects after authentication, and preserve session cookies for HTTP GETs to populate views.
### user `[https get]`
    /user
Returns a JSON object denoting the current username of the authenticated user.

**Example Output**
```JSON
{
    "username" : "some_user"
}
```

### docs
    /docs
Serves this documentation in non-production environments. May be enabled in configuration in future to be served to site-admins only.


## - Student
### get  `[https get]`
    /api/students/get
Used to get information about a student, by a field provided by the database. Returns all non-database specific data on a user.

**Permissions**
- Students may only poll on themselves
- Tutors may only poll on students they have existing appointments or appointment requests with.
- Administrators/Site Admins may poll any student.

**Valid fields**
- ID : Number - The ID *(800 Number)* of the Student
- OtherID : Number - Any other ID assigned by Banner.
- FirstName : String
- LastName : String
- FullName : String - Concatenation of the above two fields
- Email : String

**Exposed Fields**
  - ID : String
  - OtherID : Number
  - FirstName : String
  - LastName : String
  - FullName : String
  - Gender : String
  - Major : String
  - Email : String
  - IsTutor : Boolean

**Example Query**
```
    /api/students/get?field=FullName&value=Some%20User
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true,
    "result" : {
        "FirstName" : "Some",
        "LastName" : "User",
    }
}
```

*__On Failure__*
```JSON
{
    "success" : false,
    "result" : "Some Error String"
}
```

### getStudentCourses  `[https get]`
    /api/students/getStudentCourses/

Used to get the courses a student is taking. Resolves ObjectID to full object values, returning all non-database specific values from the appropriate document. Does NOT populate students, use `/api/courses/getStudentsInCourse` instead.

**Permissions**
- Students may only poll on themselves
- Tutors may only poll on students they have existing appointments or appointment requests with.
- Administrators/Site Admins may poll any student.

**Example Query**
```
    /api/students/getStudentCourses?StudentID=800987654
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true,
    "result" : [
        {
            "CourseTitle" : "Some Hard Course",
            "CourseSubject" : "Computer Science",
            "CourseSection" : 432,
            "InstructorFirstName" : "Joshua",
            "InstructorLastName" : "Eckeroth",
            "InstructorEmail" : "jeckroth@stetson.edu"
        },
    ]
}
```

*__On Failure__*
```JSON
{
    "success" : false,
    "result" : "Some Error String"
}
```

### getStudentCourses  `[https get]`
    /api/students/getStudentProfessors

Used to get the professors for courses a student is taking.

**Permissions**
- Students may only poll on themselves
- Tutors may only poll on students they have existing appointments or appointment requests with.
- Administrators/Site Admins may poll any student.

**Example Query**
```
    /api/students/getStudentProfessors?StudentID=800987654
```
**Expected Response**

*__On Success__*
```JSON
{
    "success" : true,
    "result" : [
        {
            "InstructorFirstName" : "Joshua",
            "InstructorLastName" : "Eckeroth",
            "InstructorEmail" : "jeckroth@stetson.edu"
        },
    ]
}
```

*__On Failure__*
```JSON
{
    "success" : false,
    "result" : "Some Error String"
}
```
## Administrators

### setAsTutor `[https/post]`
    /api/administrator/setAsTutor

Used to setup tutors within the database. May turn a student into a tutor, or create a non-student tutor, the latter requiring more information.

**Permissions**
- Only Administrators are allowed to access and POST to this handle.

**Example Query**

    /api/administrator/setAsTutor

*POST Body for non-Student Tutors*

```json
{
 "ID" : 800999999,
 "Subject" : "CSCI",
 "isStudentTutor" : false,
 "Email" : "someguy@stetson.edu"
}
```

*POST Body for Student Tutors*

```json
    {
        "ID" : 800999999,
        "Subject" : "CSCI",
        "isStudentTutor" : true,
    }
```

**Expected Response**

*__On Success__*

```json
{
    "success" : true,
    "result" : {
        "__v": 0,
        "isStudentTutor": false,
        "ID": 800999999,
        "Email": "someguy@stetson.edu",
        "Subject": "CSCI",
        "LifetimeSessionCount": 0,
        "LastArchivedSession": "1970-01-01T00:00:00.000Z",
        "_id": "564b80de64fee73c0702f93f",
        "Sessions": [0],
        "Username": "someguy",
        "id": "564b80de64fee73c0702f93f"
    }-
}
```
*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```
**Note**: While currently error messages are reported in full to the client, the release build will NOT display this robust form of message. Do NOT write code that relies on specific fields from MongoDB error messages.

### removeTutor `[https/post]`
    /api/administrator/removeTutor

Used to remove tutors from the database.

*TODO: remove `isStudentTutor` field from request requirements.*

**Permissions**
- Only Administrators are allowed to access and POST to this handle.

**Example Query**

    /api/students/removeTutor

*POST Body*
```json
{
    "ID" : 800999999,
    "isStudentTutor" : false,
}
```

**Expected Response**

*__On Success__*
```json
{
    "success" : true
}
```

*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```

## Tutors

### /getAll `[https/get]`

Returns an array of tutors from the database. If passed a Subject, will narrow the search to those subjects.

**Permissions:**
- Anyone can call this function.

**Example Query**
    /api/tutors/getAll?Subject=CSCI

*__On Success__*
```json
{
    "success" : true,
    "result" : [
        {
            "__v": 0,
            "isStudentTutor": false,
            "ID": 800999999,
            "Email": "someguy@stetson.edu",
            "Subject": "CSCI",
            "LifetimeSessionCount": 0,
            "LastArchivedSession": "1970-01-01T00:00:00.000Z",
            "_id": "564b80de64fee73c0702f93f",
            "Sessions": [0],
            "Username": "someguy",
            "id": "564b80de64fee73c0702f93f"
        },
    ],
}
```

*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```
### /get `[https/get]`

Returns a tutor from the database matching the field provided. Note that sessions are also populated by reference, so this is recommended when pulling a given tutor's information on login.

Accepted fields are `ID Email Subject Username`

**Permissions:**
- Anyone can call this function.

**Example Query**

    /api/tutors/get?ID=800999999


*__On Success__*
```json
{
    "success" : true,
    "result" : [
        {
            "__v": 0,
            "isStudentTutor": false,
            "ID": 800999999,
            "Email": "someguy@stetson.edu",
            "Subject": "CSCI",
            "LifetimeSessionCount": 0,
            "LastArchivedSession": "1970-01-01T00:00:00.000Z",
            "_id": "564b80de64fee73c0702f93f",
            "Sessions": [0],
            "Username": "someguy",
            "id": "564b80de64fee73c0702f93f"
        },
    ],
}
```

*__On Failure__*
```json
{
    "success" : false,
    "error" : {},
}
```
